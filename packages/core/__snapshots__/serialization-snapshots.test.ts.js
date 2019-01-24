exports['SerializationSnapshotTests abstract class Vehicle { numWheels: number = 4; abstract drive(): string; } 1'] = {
  "types": {
    "T01m4wm3y7xwt": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wm3y7xwt",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "Vehicle": [
          "symbol",
          "S01m4wn9k069r"
        ]
      }
    },
    "T01m4wmu9c278": {
      "typeString": "typeof Vehicle",
      "entity": "type",
      "id": "T01m4wmu9c278",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {},
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmb5vf23"
          ],
          "typeString": "(): Vehicle"
        }
      ]
    },
    "T01m4wmb5vf23": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wmb5vf23",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmb5vf23"
      ],
      "properties": {
        "numWheels": [
          "symbol",
          "S01m4wmgdtvcw"
        ],
        "drive": [
          "symbol",
          "S01m4wn33a75s"
        ]
      },
      "thisType": [
        "type",
        "T01m4wlvl7ayn"
      ]
    },
    "T01m4wlvl7ayn": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wlvl7ayn",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wmb5vf231"
      ]
    },
    "T01m4wmb5vf231": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wmb5vf231",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wmb5vf23"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wlvl7ayn"
        ]
      ]
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    },
    "T01m4wnhrlf5a": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wnhrlf5a",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
      ]
    },
    "T01m4wmr2p2yx": {
      "typeString": "string",
      "entity": "type",
      "id": "T01m4wmr2p2yx",
      "flags": [
        "String"
      ],
      "primitive": true
    }
  },
  "symbols": {
    "S01m4wnpu3s0a": {
      "id": "S01m4wnpu3s0a",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wm3y7xwt"
      ],
      "exports": {
        "Vehicle": [
          "symbol",
          "S01m4wn9k069r"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wn9k069r": {
      "id": "S01m4wn9k069r",
      "entity": "symbol",
      "name": "Vehicle",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wmu9c278"
      ],
      "modifiers": [
        "export",
        "FirstContextualKeyword"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        1,
        1,
        5,
        1
      ]
    },
    "S01m4wmgdtvcw": {
      "id": "S01m4wmgdtvcw",
      "entity": "symbol",
      "name": "numWheels",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        2,
        0,
        2,
        31
      ]
    },
    "S01m4wn33a75s": {
      "id": "S01m4wn33a75s",
      "entity": "symbol",
      "name": "drive",
      "flags": [
        "Method"
      ],
      "type": [
        "type",
        "T01m4wnhrlf5a"
      ],
      "modifiers": [
        "public",
        "FirstContextualKeyword"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n80"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n80"
        ],
        3,
        0,
        4,
        34
      ]
    }
  }
}

exports['SerializationSnapshotTests class Vehicle { numWheels: number = 4; drive() { return "vroom";} } 1'] = {
  "types": {
    "T01m4wn7v0f21": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wn7v0f21",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "Vehicle": [
          "symbol",
          "S01m4wmhsi9fo"
        ]
      }
    },
    "T01m4wnwgm39y": {
      "typeString": "typeof Vehicle",
      "entity": "type",
      "id": "T01m4wnwgm39y",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {},
      "constructorSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wlum8wjm"
          ],
          "typeString": "(): Vehicle"
        }
      ]
    },
    "T01m4wlum8wjm": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wlum8wjm",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Class",
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wlum8wjm"
      ],
      "properties": {
        "numWheels": [
          "symbol",
          "S01m4wmgd91qw"
        ],
        "drive": [
          "symbol",
          "S01m4wnqvk3ho"
        ]
      },
      "thisType": [
        "type",
        "T01m4wnfjndq3"
      ]
    },
    "T01m4wnfjndq3": {
      "typeString": "this",
      "entity": "type",
      "id": "T01m4wnfjndq3",
      "flags": [
        "TypeParameter"
      ],
      "isThisType": true,
      "constraint": [
        "type",
        "T01m4wlum8wjm1"
      ]
    },
    "T01m4wlum8wjm1": {
      "typeString": "Vehicle",
      "entity": "type",
      "id": "T01m4wlum8wjm1",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Reference"
      ],
      "target": [
        "type",
        "T01m4wlum8wjm"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wnfjndq3"
        ]
      ]
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    },
    "T01m4wmrd30df": {
      "typeString": "() => string",
      "entity": "type",
      "id": "T01m4wmrd30df",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous",
        "Instantiated"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "typeString": "(): string"
        }
      ]
    },
    "T01m4wmr2p2yx": {
      "typeString": "string",
      "entity": "type",
      "id": "T01m4wmr2p2yx",
      "flags": [
        "String"
      ],
      "primitive": true
    }
  },
  "symbols": {
    "S01m4wnpj4pis": {
      "id": "S01m4wnpj4pis",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wn7v0f21"
      ],
      "exports": {
        "Vehicle": [
          "symbol",
          "S01m4wmhsi9fo"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        1,
        1,
        7,
        1
      ]
    },
    "S01m4wmhsi9fo": {
      "id": "S01m4wmhsi9fo",
      "entity": "symbol",
      "name": "Vehicle",
      "flags": [
        "Class"
      ],
      "type": [
        "type",
        "T01m4wnwgm39y"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        1,
        1,
        7,
        1
      ]
    },
    "S01m4wmgd91qw": {
      "id": "S01m4wmgd91qw",
      "entity": "symbol",
      "name": "numWheels",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        2,
        0,
        2,
        31
      ]
    },
    "S01m4wnqvk3ho": {
      "id": "S01m4wnqvk3ho",
      "entity": "symbol",
      "name": "drive",
      "flags": [
        "Method",
        "Transient"
      ],
      "type": [
        "type",
        "T01m4wmrd30df"
      ],
      "modifiers": [
        "public"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wmlw3n74"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wmlw3n74"
        ],
        3,
        0,
        6,
        3
      ]
    }
  }
}

exports['SerializationSnapshotTests const p: Promise<number> = Promise.resolve(4); 1'] = {
  "types": {
    "T01m4wmqijhej": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wmqijhej",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "p": [
          "symbol",
          "S01m4wnkhr6h7"
        ]
      }
    },
    "T01m4wm50lj61": {
      "typeString": "Promise<number>",
      "entity": "type",
      "id": "T01m4wm50lj61",
      "flags": [
        "Object"
      ],
      "libName": "lib.es5.d.ts"
    }
  },
  "symbols": {
    "S01m4wm47bq6w": {
      "id": "S01m4wm47bq6w",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wmqijhej"
      ],
      "exports": {
        "p": [
          "symbol",
          "S01m4wnkhr6h7"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk33"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk33"
        ],
        1,
        1,
        1,
        53
      ]
    },
    "S01m4wnkhr6h7": {
      "id": "S01m4wnkhr6h7",
      "entity": "symbol",
      "name": "p",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wm50lj61"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk33"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk33"
        ],
        1,
        13,
        1,
        52
      ]
    }
  }
}

exports['SerializationSnapshotTests const x = "foo" 1'] = {
  "types": {
    "T01m4wnq6yv31": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wnq6yv31",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wmirtbv4"
        ]
      }
    },
    "T01m4wmr2q7oq": {
      "typeString": "\"foo\"",
      "entity": "type",
      "id": "T01m4wmr2q7oq",
      "flags": [
        "StringLiteral"
      ]
    }
  },
  "symbols": {
    "S01m4wnph853a": {
      "id": "S01m4wnph853a",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wnq6yv31"
      ],
      "exports": {
        "x": [
          "symbol",
          "S01m4wmirtbv4"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhpp"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhpp"
        ],
        1,
        1,
        1,
        23
      ]
    },
    "S01m4wmirtbv4": {
      "id": "S01m4wmirtbv4",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2q7oq"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhpp"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhpp"
        ],
        1,
        13,
        1,
        22
      ]
    }
  }
}

exports['SerializationSnapshotTests function add(a: number, b: string) { return a + b; } 1'] = {
  "types": {
    "T01m4wms4srob": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wms4srob",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "add": [
          "symbol",
          "S01m4wllagwsj"
        ]
      }
    },
    "T01m4wmqo0i12": {
      "typeString": "(a: number, b: string) => string",
      "entity": "type",
      "id": "T01m4wmqo0i12",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "callSignatures": [
        {
          "returnType": [
            "type",
            "T01m4wmr2p2yx"
          ],
          "parameters": [
            [
              "symbol",
              "S01m4wnk0jsvw"
            ],
            [
              "symbol",
              "S01m4wm96055y"
            ]
          ],
          "typeString": "(a: number, b: string): string"
        }
      ]
    },
    "T01m4wmr2p2yx": {
      "typeString": "string",
      "entity": "type",
      "id": "T01m4wmr2p2yx",
      "flags": [
        "String"
      ],
      "primitive": true
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    }
  },
  "symbols": {
    "S01m4wlmcgydk": {
      "id": "S01m4wlmcgydk",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wms4srob"
      ],
      "exports": {
        "add": [
          "symbol",
          "S01m4wllagwsj"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        1,
        1,
        59
      ]
    },
    "S01m4wllagwsj": {
      "id": "S01m4wllagwsj",
      "entity": "symbol",
      "name": "add",
      "flags": [
        "Function"
      ],
      "type": [
        "type",
        "T01m4wmqo0i12"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        1,
        1,
        59
      ]
    },
    "S01m4wnk0jsvw": {
      "id": "S01m4wnk0jsvw",
      "entity": "symbol",
      "name": "a",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        21,
        1,
        29
      ]
    },
    "S01m4wm96055y": {
      "id": "S01m4wm96055y",
      "entity": "symbol",
      "name": "b",
      "flags": [
        "FunctionScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk8e"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk8e"
        ],
        1,
        31,
        1,
        40
      ]
    }
  }
}

exports['SerializationSnapshotTests interface Foo {bar: number; readonly baz: Promise<string>} 1'] = {
  "types": {
    "T01m4wm96bh7s": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wm96bh7s",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ]
    },
    "T01m4wmp9klrl": {
      "typeString": "Foo",
      "entity": "type",
      "id": "T01m4wmp9klrl",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Interface"
      ],
      "properties": {
        "bar": [
          "symbol",
          "S01m4wn7l12a9"
        ],
        "baz": [
          "symbol",
          "S01m4wma48v2g"
        ]
      }
    },
    "T01m4wmr2p302": {
      "typeString": "number",
      "entity": "type",
      "id": "T01m4wmr2p302",
      "flags": [
        "Number"
      ],
      "primitive": true
    },
    "T01m4wlxcvbvh": {
      "typeString": "Promise<string>",
      "entity": "type",
      "id": "T01m4wlxcvbvh",
      "flags": [
        "Object"
      ],
      "libName": "lib.es5.d.ts"
    }
  },
  "symbols": {
    "S01m4wntycam2": {
      "id": "S01m4wntycam2",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wm96bh7s"
      ],
      "exports": {
        "default": [
          "symbol",
          "S01m4wlmu7jqa"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyln0"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyln0"
        ],
        1,
        1,
        1,
        73
      ]
    },
    "S01m4wlmu7jqa": {
      "id": "S01m4wlmu7jqa",
      "entity": "symbol",
      "name": "default",
      "flags": [
        "Interface"
      ],
      "type": [
        "type",
        "T01m4wmp9klrl"
      ]
    },
    "S01m4wn7l12a9": {
      "id": "S01m4wn7l12a9",
      "entity": "symbol",
      "name": "bar",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wmr2p302"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyln0"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyln0"
        ],
        1,
        31,
        1,
        42
      ]
    },
    "S01m4wma48v2g": {
      "id": "S01m4wma48v2g",
      "entity": "symbol",
      "name": "baz",
      "flags": [
        "Property"
      ],
      "type": [
        "type",
        "T01m4wlxcvbvh"
      ],
      "modifiers": [
        "readonly"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyln0"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyln0"
        ],
        1,
        43,
        1,
        72
      ]
    }
  }
}

exports['SerializationSnapshotTests let x = "foo" 1'] = {
  "types": {
    "T01m4wlqrgfql": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wlqrgfql",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "properties": {
        "x": [
          "symbol",
          "S01m4wmirrx8p"
        ]
      }
    },
    "T01m4wmr2p2yx": {
      "typeString": "string",
      "entity": "type",
      "id": "T01m4wmr2p2yx",
      "flags": [
        "String"
      ],
      "primitive": true
    }
  },
  "symbols": {
    "S01m4wnc6adxq": {
      "id": "S01m4wnc6adxq",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlqrgfql"
      ],
      "exports": {
        "x": [
          "symbol",
          "S01m4wmirrx8p"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhnx"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhnx"
        ],
        1,
        1,
        1,
        21
      ]
    },
    "S01m4wmirrx8p": {
      "id": "S01m4wmirrx8p",
      "entity": "symbol",
      "name": "x",
      "flags": [
        "BlockScopedVariable"
      ],
      "type": [
        "type",
        "T01m4wmr2p2yx"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyhnx"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyhnx"
        ],
        1,
        11,
        1,
        20
      ]
    }
  }
}

exports['SerializationSnapshotTests type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T | undefined } 1'] = {
  "types": {
    "T01m4wmqcfkr3": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wmqcfkr3",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ]
    },
    "T01m4wlmpiil5": {
      "typeString": "Dict<T>",
      "entity": "type",
      "id": "T01m4wlmpiil5",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wlxxxspc"
        ]
      ],
      "stringIndexType": [
        "type",
        "T01m4wlxxxspc"
      ]
    },
    "T01m4wlxxxspc": {
      "typeString": "T",
      "entity": "type",
      "id": "T01m4wlxxxspc",
      "flags": [
        "TypeParameter"
      ],
      "constraint": [
        "type",
        "T01m4wntf4uds"
      ]
    },
    "T01m4wntf4uds": {
      "typeString": "\"foo\" | \"bar\" | \"baz\"",
      "entity": "type",
      "id": "T01m4wntf4uds",
      "flags": [
        "Union"
      ]
    }
  },
  "symbols": {
    "S01m4wlp33qpb": {
      "id": "S01m4wlp33qpb",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wmqcfkr3"
      ],
      "exports": {
        "Dict": [
          "symbol",
          "S01m4wmnqibyq"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        1,
        1,
        1,
        78
      ]
    },
    "S01m4wmnqibyq": {
      "id": "S01m4wmnqibyq",
      "entity": "symbol",
      "name": "Dict",
      "flags": [
        "TypeAlias"
      ],
      "type": [
        "type",
        "T01m4wlmpiil5"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkylrf"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkylrf"
        ],
        1,
        1,
        1,
        78
      ]
    }
  }
}

exports['SerializationSnapshotTests type Dict<T> = { [k: string]: T | undefined } 1'] = {
  "types": {
    "T01m4wlwowu0v": {
      "typeString": "typeof import(\"/src/index\")",
      "entity": "type",
      "id": "T01m4wlwowu0v",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ]
    },
    "T01m4wlmpiil5": {
      "typeString": "Dict<T>",
      "entity": "type",
      "id": "T01m4wlmpiil5",
      "flags": [
        "Object"
      ],
      "objectFlags": [
        "Anonymous"
      ],
      "typeParameters": [
        [
          "type",
          "T01m4wlxxxspc"
        ]
      ],
      "stringIndexType": [
        "type",
        "T01m4wlxxxspc"
      ]
    },
    "T01m4wlxxxspc": {
      "typeString": "T",
      "entity": "type",
      "id": "T01m4wlxxxspc",
      "flags": [
        "TypeParameter"
      ]
    }
  },
  "symbols": {
    "S01m4wly6rqhi": {
      "id": "S01m4wly6rqhi",
      "entity": "symbol",
      "name": "\"/src/index\"",
      "flags": [
        "ValueModule"
      ],
      "type": [
        "type",
        "T01m4wlwowu0v"
      ],
      "exports": {
        "Dict": [
          "symbol",
          "S01m4wmnqibyq"
        ]
      },
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk27"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk27"
        ],
        1,
        1,
        1,
        52
      ]
    },
    "S01m4wmnqibyq": {
      "id": "S01m4wmnqibyq",
      "entity": "symbol",
      "name": "Dict",
      "flags": [
        "TypeAlias"
      ],
      "type": [
        "type",
        "T01m4wlmpiil5"
      ],
      "modifiers": [
        "export"
      ],
      "sourceFile": [
        "sourceFile",
        "F01m4wnwkyk27"
      ],
      "location": [
        [
          "sourceFile",
          "F01m4wnwkyk27"
        ],
        1,
        1,
        1,
        52
      ]
    }
  }
}
