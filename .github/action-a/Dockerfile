
FROM debian:9.6-slim

LABEL "com.github.actions.name"="Hello World"
LABEL "com.github.actions.description"="Write arguments to the standard output"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="http://github.com/mike-north/code-to-json"
LABEL "homepage"="http://github.com/mike-north/code-to-json"
LABEL "maintainer"="Mike North <michael.l.north@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]