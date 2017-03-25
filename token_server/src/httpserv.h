typedef struct httpserv* httpserv;
typedef struct httpcli* httpcli;

// HTTP server functions
httpserv* http_init_server(int, int);
void* http_listen_thread(void*);
void http_server_listen(httpserv*);
void http_server_stop(httpserv*);
// HTTP client functions
void* http_handle_client(void*);
int httpcli_write_str(httpcli*, char*);
int httpcli_write(httpcli*, char*, int);
int httpcli_read(httpcli*, char*, int);