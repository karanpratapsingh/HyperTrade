package tasks

import (
	"encoding/json"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog/log"
)

var (
	SignalBuy  = "Task:Signal:Buy"
	SignalSell = "Task:Signal:Sell"
	Kline      = "Task:Kline"
)

type Tasks struct {
	client *asynq.Client
}

func NewTasks(addr string) Tasks {
	client := asynq.NewClient(asynq.RedisClientOpt{Addr: addr})
	return Tasks{client}
}

func (t Tasks) NewTask(taskname string, data interface{}) {
	payload, err := json.Marshal(data)
	if err != nil {
		log.Error().Err(err)
	}

	task := asynq.NewTask(taskname, payload)

	t.client.Enqueue(task, asynq.MaxRetry(1))
}

func (t Tasks) Close() error {
	return t.client.Close()
}
