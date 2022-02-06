FROM golang:1.17.2-alpine AS development
ENV GOOS linux
ENV CGO_ENABLED 0
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
EXPOSE 80
RUN go install github.com/cespare/reflex@latest
CMD reflex -g '**/*.go' -s go run main.go

FROM golang:1.17.2-alpine AS builder
ENV GOOS linux
ENV CGO_ENABLED 0
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN go build -o app

FROM gcr.io/distroless/static AS production
COPY --from=builder app ./
EXPOSE 80
CMD ["/app"]
