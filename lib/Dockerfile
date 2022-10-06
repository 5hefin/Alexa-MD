FROM quay.io/shefin/alexa:md
RUN git clone https://github.com/5hefin/Alexa-MD /root/Alexa/
WORKDIR /root/Alexa/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
