#pragma once

#define LOG_MODE_INFO   0 // Default
#define LOG_MODE_WARN   1
#define LOG_MODE_DEBUG  2
#define LOG_MODE_ALL    3
#define LOG_MODE_NONE   -1 // Only logs errors

#define USAGE "Usage: ./tokenserver [args]\n\
-h / --help : Show this message \n\
-p [Port number] Listen the HTTP server on the specified port\n\
-b [Backlog] The amount of backlog allowed on the HTTP server (default 5)\n\
-l [Log level] Set the log level, which can be one of the following:\n\
0 - Info (default)\n\
1 - Warn\n\
2 - Debug\n\
3 - All\n\
-1 - None\n"

static int logger_mode = 0;
void set_logger_mode(int);
void log_info(const char*);
void log_infod(const char*, int);
void log_warn(const char*);
void log_debug(const char*);
void log_all(const char*);
void log_error(const char*);
void log_fatal(const char*);