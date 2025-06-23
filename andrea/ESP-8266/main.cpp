#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <time.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

#define BTN_NEXT D6  // Botão próximo
#define BTN_PREV D7  // Botão anterior

const char* mqtt_server = "xxx.xx.xx.xx"; // IP do broker MQTT local
const char* mqtt_topic = "display/message"; // topico

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

String mensagens[30]; // Armazenar mensagens (30 mensagens)
int totalMensagens = 0;
int mensagemIndex = 0;
bool newMessage = false;

unsigned long tempo = 0;
unsigned long ultimoEvento = 0;
bool mostrandoRelogio = false;

void mostrarRelogio() {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 20);

  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);
  char buffer[16];
  strftime(buffer, sizeof(buffer), "%H:%M:%S", timeinfo);
  display.println(buffer);

  display.setTextSize(1);
  display.setCursor(5, 55); // -----------------
  //display.println("Horario Local");
  display.display();
}

void ultimaMensagem() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  // if (totalMensagens == 0) {
  //   display.println("...");
  // } else {
    display.println("Mensagens do Dia:");
    display.setTextSize(2);
    display.setCursor(0, 20);
    display.println(mensagens[mensagemIndex]);
    display.setTextSize(1);
    display.setCursor(0, 55);
    display.printf("%d/%d", mensagemIndex + 1, totalMensagens);
  // }
  display.display();
}

void debugBotoes() {
  if (digitalRead(BTN_NEXT) == LOW) {
    Serial.println("BTN_NEXT pressionado");
    delay(200); //
  }
  if (digitalRead(BTN_PREV) == LOW) {
    Serial.println("BTN_PREV pressionado");
    delay(200); //
  }
}

void callback(char* topic, byte* payload, unsigned int tamanho) {
  String novaMsg = "";
  for (int i = 0; i < tamanho; i++) {
    novaMsg += (char)payload[i];
  }
  if (totalMensagens < 30) {
    mensagens[totalMensagens] = novaMsg;
    mensagemIndex = totalMensagens;
    totalMensagens++;
  } else {
    // sobrescreve mensagem mais antiga
    mensagemIndex = (mensagemIndex + 1) % 30;
    mensagens[mensagemIndex] = novaMsg;
  }
  newMessage = true;
}

void reconnectMqtt() {
  while (!client.connected()) {
    if (client.connect("esp8266_display_client")) {
      client.subscribe(mqtt_topic);
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Wire.begin(5, 4); // Pinos SDA e SCL para o ESP8266
  Serial.begin(9600);

  pinMode(BTN_NEXT, INPUT_PULLUP);
  pinMode(BTN_PREV, INPUT_PULLUP);

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("Falha na Inicialização do Display"));
    for (;;);
  }

  // MENSAGEM DE CONEXÃO
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Conectando ao WiFi...");
  display.display();

  WiFi.begin("xxxxx", "xxxxxxx"); // SSID e senha WiFi

  delay(6000);

  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov"); // UTC-3

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  ultimoEvento = millis();
  ultimaMensagem();
}

void loop() {
  debugBotoes();
  if (!client.connected()) {
    reconnectMqtt();
  }

  client.loop();

  bool botaoAcionado = false;

  // Botão >
  if (digitalRead(BTN_NEXT) == LOW && totalMensagens > 0 && millis() - tempo > 300) {
    mensagemIndex = (mensagemIndex + 1) % totalMensagens;
    ultimaMensagem();
    tempo = millis();
    ultimoEvento = millis();
    mostrandoRelogio = false;
    botaoAcionado = true;
  }
  // Botão <
  if (digitalRead(BTN_PREV) == LOW && totalMensagens > 0 && millis() - tempo > 300) {
    mensagemIndex = (mensagemIndex - 1 + totalMensagens) % totalMensagens;
    ultimaMensagem();
    tempo = millis();
    ultimoEvento = millis();
    mostrandoRelogio = false;
    botaoAcionado = true;
  }

  // Nova mensagem recebida
  if (newMessage) {
    ultimaMensagem();
    newMessage = false;
    ultimoEvento = millis();
    mostrandoRelogio = false;
  }

  // mostrar relógio após 20 segundos
  if (!mostrandoRelogio && (millis() - ultimoEvento > 20000)) {
    mostrarRelogio();
    mostrandoRelogio = true;
  }

  // atualizar o relógio a cada segundo
  static unsigned long lastClockUpdate = 0;
  if (mostrandoRelogio && millis() - lastClockUpdate > 1000) {
    mostrarRelogio();
    lastClockUpdate = millis();
  }

  // mostrar relogio
  if (botaoAcionado && mostrandoRelogio) {
    ultimaMensagem();
    mostrandoRelogio = false;
  }
}