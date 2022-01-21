FROM python:3.8
WORKDIR /app
# Setup TA-Lib
RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc wget
RUN wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz && tar -xzf ta-lib-0.4.0-src.tar.gz && cd ta-lib/ && ./configure --prefix=/usr && make && make install

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
