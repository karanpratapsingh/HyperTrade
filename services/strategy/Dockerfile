FROM karanpratapsingh4/python:ta-lib AS development
WORKDIR /app
RUN pip3 install watchdog pyyaml
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . ./
EXPOSE 80
CMD watchmedo shell-command --recursive --patterns="*.py" --command='python3 main.py' .

FROM karanpratapsingh4/python:ta-lib AS production
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . ./
EXPOSE 80
CMD python3 main.py
