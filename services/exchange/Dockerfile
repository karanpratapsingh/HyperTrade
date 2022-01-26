FROM golang:1.17.2 AS development
ENV GOOS linux
ENV CGO_ENABLED 0
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
EXPOSE 4000
RUN go install github.com/cespare/reflex@latest
CMD reflex -g '**/*.go' -s go run main.go

FROM golang:1.17.2 AS builder
ENV GOOS linux
ENV CGO_ENABLED 0
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN go build -o app

FROM gcr.io/distroless/static
COPY --from=builder app ./
EXPOSE 4000
CMD ["/app"]
