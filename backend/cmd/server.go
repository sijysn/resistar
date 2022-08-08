package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/sijysn/resistar/backend/graph"
	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/internal/driver"
)

const defaultPort = "8080"

func run() {
	log.Println("Connecting to database...")
	db, err := driver.ConnectDB("host=localhost port=5432 dbname=resistar_development user=yoshinoseiji password=")
	if err != nil {
		log.Fatal("cannot connect to database!")
	}
	log.Println("Connected to database!")

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}