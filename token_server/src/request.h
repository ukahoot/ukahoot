#pragma once

typedef struct req* req;
void setup_openssl(void);
req* init_request(void);
void request_connect(req*);
void request_write_str(req*, char*);
int request_read(req*, char*, int);
void request_close(req*);
void request_free(req*);
char* request_kahoot_token(req*, char*);
void unload_ctx(void);