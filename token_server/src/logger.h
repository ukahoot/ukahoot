#define LOG_MODE_INFO   0 // Default
#define LOG_MODE_WARN   1
#define LOG_MODE_DEBUG  2
#define LOG_MODE_ALL    3

static int logger_mode = NULL;
void set_logger_mode(int);
void log_info(const char*);
void log_warn(const char*);
void log_debug(const char*);
void log_all(const char*);