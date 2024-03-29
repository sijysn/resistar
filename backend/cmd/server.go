package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/alexedwards/scs/v2"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/sijysn/resistar/backend/graph"
	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/internal/driver"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/internal/migrate"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/usecase"
)

const defaultPort = "8080"
const timezone = "Asia/Tokyo"

var session *scs.SessionManager

func run() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("cannot load env file!")
	}

	loc, err := time.LoadLocation(timezone)
	if err != nil {
			loc = time.FixedZone(timezone, 9*60*60)
	}
	time.Local = loc

	log.Println("Connecting to database...")
	url := os.Getenv("DATABASE_URL")
	db, err := driver.ConnectDB(url)
	if err != nil {
		log.Fatal("cannot connect to database!")
	}
	log.Println("Connected to database!")

	migrate.Migrate(db)

	session = scs.New()
	session.Lifetime = 24 * time.Hour
	session.Cookie.SameSite = http.SameSiteNoneMode
	session.Cookie.Secure = true
	env := os.Getenv("ENV")
	if env == "production" {
		session.Cookie.Domain = "resistar.net"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	repository := repository.NewRepository(db)
	usecase := usecase.NewUsecase(repository)
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db, Session: session, Usecase: usecase }}))

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080", "https://web.resistar.net"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Access-Control-Allow-Headers", "Authorization", "Content-Type"},
		Debug:            true,
	}).Handler)
	router.Use(middleware.Middleware(repository))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, session.LoadAndSave(router)))
}
