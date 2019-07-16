FROM beevelop/cordova as bCordova

RUN \
  npm i -g yarn; \
  npm install -g npm@6.9.0; \
  npm install -g cordova@8.1.2; \
  npm install -g @vue/cli@3.0.1; \
  cordova telemetry off;

# Licenses...
RUN ( while [ 1 ]; do sleep 10; echo y; done ) | android update sdk -a --no-ui --filter build-tools-28.0.3,android-28

VOLUME /scripts /cordova-in /cordova-out /root/.gradle /root/.cache/yarn /root/.android /cred /corteza-webapp-auth /corteza-webapp-messaging /crust-webapp-messaging
RUN yarn config set cache-folder /root/.cache/yarn/v2
WORKDIR /scripts
ENTRYPOINT ["./run.sh"]
