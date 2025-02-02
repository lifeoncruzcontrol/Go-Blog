FROM golang:latest AS builder

WORKDIR /go-blog-api

# Copy go.mod and go.sum first to leverage Docker caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . . 

# Build a statically linked binary
RUN CGO_ENABLED=0 go build -o go-blog-api ./cmd/go-blog-api

# Use a minimal final image
FROM gcr.io/distroless/static-debian10

WORKDIR /go-blog-api

# Copy only the compiled binary from the builder stage
COPY --from=builder /go-blog-api/go-blog-api .

EXPOSE 8080

CMD ["./go-blog-api"]