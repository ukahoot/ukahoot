typedef struct httpserv* httpserv;
typedef struct httpcli* httpcli;

httpserv* http_init_server(int, int);
void* http_listen_thread(void*);
void http_server_listen(httpserv*);