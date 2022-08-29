package main

import (
	"fmt"
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
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/config"
	"github.com/sijysn/resistar/backend/internal/driver"
	"github.com/sijysn/resistar/backend/internal/migrate"
	"gorm.io/gorm"
)

const defaultPort = "8080"

var app *config.AppConfig
var session *scs.SessionManager

func run() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("cannot load env file!")
	}
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")

	log.Println("Connecting to database...")

	url := os.Getenv("DATABASE_URL")
	var db *gorm.DB
	if (url == "") {
		db, err = driver.ConnectDB("pgx", fmt.Sprintf("host=%s port=%s dbname=%s user=%s password=%s", dbHost, dbPort, dbName, dbUser, dbPassword))
	} else {
		db, err = driver.ConnectDB("pgx", url)
	}
	if err != nil {
		log.Fatal("cannot connect to database!")
	}
	log.Println("Connected to database!")

	migrate.Migrate(db)

	session = scs.New()
	session.Lifetime = 24 * time.Hour
	session.Cookie.SameSite = http.SameSiteLaxMode

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db, Session: session}}))

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)
	router.Use(auth.Middleware(db))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, session.LoadAndSave(router)))
}