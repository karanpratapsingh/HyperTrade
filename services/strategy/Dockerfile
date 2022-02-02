FROM karanpratapsingh4/python:ta-lib
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . ./
EXPOSE 80
CMD python3 main.py
