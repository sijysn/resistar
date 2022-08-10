package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/rs/cors"
	"github.com/sijysn/resistar/backend/graph"
	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/internal/driver"
	"github.com/sijysn/resistar/backend/internal/migrate"
)

const defaultPort = "8080"

func run() {
	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)


	log.Println("Connecting to database...")
	db, err := driver.ConnectDB("host=localhost port=5432 dbname=resistar_development user=yoshinoseiji password=")
	if err != nil {
		log.Fatal("cannot connect to database!")
	}
	log.Println("Connected to database!")

	migrate.Migrate(db)

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}