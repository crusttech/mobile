FROM beevelop/cordova as bCordova

RUN \
  npm i -g yarn; \
  npm install -g npm@6.9.0; \
  npm install -g cordova@8.1.2; \
  npm install -g @vue/cli@3.0.1; \
  cordova telemetry off;

# Licenses...
# This installs 30- Android SDK Build-tools, revision 21.1.2
RUN ( while [ 1 ]; do sleep 10; echo y; done ) | android update sdk --no-ui --filter 30

VOLUME /builder /p_in /c_in /c_out /root/.gradle /root/.cache/yarn /root/.android
RUN yarn config set cache-folder /root/.cache/yarn/v2
WORKDIR /builder
COPY ./run.sh run.sh
ENTRYPOINT ["./run.sh"]
