main -> anyLine:*

anyLine 
   ->  comment EOL {% function(d) { return null; }%}
    |  lbl EOL {% ([d]) => { return d[0].concat(d[1].join('')); } %}
    |  EOL {% function(d) { return null; }%}

lbl -> [.a-zA-Z] [a-zA-Z0-9]:* ":"

comment -> ";" [^EOL]:* {% function(d) { return null; }%}
blankLine -> _ {% function(d) { return null; }%}
_ -> [ \t]:+ {% function(d) { return null; } %}
EOL -> "\n\r?" {% function(d) { return null; } %}