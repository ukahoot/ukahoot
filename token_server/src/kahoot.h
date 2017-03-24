#define KAHOOT_SSL_PORT 443
#define KAHOOT_HOST_URI "kahoot.it"
#define KAHOOT_TOKEN_GET "GET /reserve/session/"

static const char* KAHOOT_TOKEN_HEADERS = " HTTP/1.1\r\n\
Host: kahoot.it\r\n\
Connection: keep-alive\r\n\
Accept: application/json, text/plain, */*\r\n\
User-Agent: ukahoot-token-server\r\n\
Referer: https://kahoot.it/\r\n\
Accept-Language: en-US,en;q=0.8\r\n";