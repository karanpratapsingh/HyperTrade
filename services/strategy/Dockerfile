FROM python:3.8-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc wget
RUN wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz &&\
tar -xzf ta-lib-0.4.0-src.tar.gz &&\
cd ta-lib/ &&\
wget 'http://git.savannah.gnu.org/gitweb/?p=config.git;a=blob_plain;f=config.guess;hb=HEAD' -O config.guess &&\
wget 'http://git.savannah.gnu.org/gitweb/?p=config.git;a=blob_plain;f=config.sub;hb=HEAD' -O config.sub &&\
./configure --prefix=/usr &&\
make && make install
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . ./
EXPOSE 80
CMD python3 main.py
