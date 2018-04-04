# Use meteor-launchpad docker image: https://github.com/jshimko/meteor-launchpad
FROM jshimko/meteor-launchpad:latest

# replace this with your application's default port
EXPOSE 8888

# install grafana and influxdb
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates \
    && echo "deb https://packagecloud.io/grafana/stable/debian/ jessie main " | tee -a /etc/apt/sources.list \
    && curl https://packagecloud.io/gpg.key | apt-key add - \
    && curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add - \
    && source /etc/os-release \
    && test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list \
    && test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list \
    && test $VERSION_ID = "9" && echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list \
    && apt-get update && apt-get install -y grafana influxdb



