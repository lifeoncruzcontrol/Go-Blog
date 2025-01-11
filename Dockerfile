FROM golang:latest

WORKDIR /go-blog-api

COPY go.mod ./

COPY go.sum ./

RUN go mod download

COPY . .

EXPOSE 8080

RUN go build -o go-blog-api ./cmd/go-blog-api

CMD ["./go-blog-api"]