var EXAMPLE_JOURNAL = {
    "program1": {
        "player_name": "Steady",
        "start_ip": 0,
        "code": [
            {
                "addr": 0,
                "opcode": "PUSH",
                "arg": 2
            },
            {
                "addr": 1,
                "opcode": "INC",
                "arg": 1
            },
            {
                "addr": 2,
                "opcode": "DUPE",
                "arg": null
            },
            {
                "addr": 3,
                "opcode": "COPY",
                "arg": 2
            },
            {
                "addr": 4,
                "opcode": "JUMP",
                "arg": -3
            },
            {
                "addr": 5,
                "opcode": "HCF",
                "arg": null
            }
        ]
    },
    "program2": {
        "player_name": "Precision",
        "start_ip": 128,
        "code": [
            {
                "addr": 128,
                "opcode": "PUSH",
                "arg": 16
            },
            {
                "addr": 129,
                "opcode": "DUPE",
                "arg": null
            },
            {
                "addr": 130,
                "opcode": "SCAN",
                "arg": 16
            },
            {
                "addr": 131,
                "opcode": "JUMPG",
                "arg": 3
            },
            {
                "addr": 132,
                "opcode": "INC",
                "arg": 16
            },
            {
                "addr": 133,
                "opcode": "JUMP",
                "arg": -4
            },
            {
                "addr": 134,
                "opcode": "INC",
                "arg": -6
            },
            {
                "addr": 135,
                "opcode": "DUPE",
                "arg": null
            },
            {
                "addr": 136,
                "opcode": "COPY",
                "arg": 3
            },
            {
                "addr": 137,
                "opcode": "INC",
                "arg": 1
            },
            {
                "addr": 138,
                "opcode": "JUMP",
                "arg": -3
            },
            {
                "addr": 139,
                "opcode": "HCF",
                "arg": null
            }
        ]
    },
    "journal": [
        {
            "cycle": 1,
            "program": 1,
            "status": 0,
            "opcode": "PUSH",
            "arg": 2,
            "new_ip": 1,
            "new_stack": "2",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 1,
            "program": 2,
            "status": 0,
            "opcode": "PUSH",
            "arg": 16,
            "new_ip": 129,
            "new_stack": "16",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 2,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "3",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 2,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "16,16",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 3,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "3,3",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 3,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "16,0",
            "read_addr_first": 146,
            "read_addr_last": 162
        },
        {
            "cycle": 4,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "3",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 6,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 4,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 132,
            "new_stack": "16",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 5,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "3",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 5,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 16,
            "new_ip": 133,
            "new_stack": "32",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 6,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "4",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 6,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -4,
            "new_ip": 129,
            "new_stack": "32",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 7,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "4,4",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 7,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "32,32",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 8,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "4",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 7,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 8,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "32,0",
            "read_addr_first": 162,
            "read_addr_last": 178
        },
        {
            "cycle": 9,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "4",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 9,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 132,
            "new_stack": "32",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 10,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "5",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 10,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 16,
            "new_ip": 133,
            "new_stack": "48",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 11,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "5,5",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 11,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -4,
            "new_ip": 129,
            "new_stack": "48",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 12,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "5",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 8,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 12,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "48,48",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 13,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "5",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 13,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "48,0",
            "read_addr_first": 178,
            "read_addr_last": 194
        },
        {
            "cycle": 14,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "6",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 14,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 132,
            "new_stack": "48",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 15,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "6,6",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 15,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 16,
            "new_ip": 133,
            "new_stack": "64",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 16,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "6",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 9,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 16,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -4,
            "new_ip": 129,
            "new_stack": "64",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 17,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "6",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 17,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "64,64",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 18,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "7",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 18,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "64,0",
            "read_addr_first": 194,
            "read_addr_last": 210
        },
        {
            "cycle": 19,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "7,7",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 19,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 132,
            "new_stack": "64",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 20,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "7",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 10,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 20,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 16,
            "new_ip": 133,
            "new_stack": "80",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 21,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "7",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 21,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -4,
            "new_ip": 129,
            "new_stack": "80",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 22,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "8",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 22,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "80,80",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 23,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "8,8",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 23,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "80,0",
            "read_addr_first": 210,
            "read_addr_last": 226
        },
        {
            "cycle": 24,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "8",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 11,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 24,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 132,
            "new_stack": "80",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 25,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "8",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 25,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 16,
            "new_ip": 133,
            "new_stack": "96",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 26,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "9",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 26,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -4,
            "new_ip": 129,
            "new_stack": "96",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 27,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "9,9",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 27,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "96,96",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 28,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "9",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 12,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 28,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "96,0",
            "read_addr_first": 226,
            "read_addr_last": 242
        },
        {
            "cycle": 29,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "9",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 29,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 132,
            "new_stack": "96",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 30,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "10",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 30,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 16,
            "new_ip": 133,
            "new_stack": "112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 31,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "10,10",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 31,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -4,
            "new_ip": 129,
            "new_stack": "112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 32,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "10",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 13,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 32,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 130,
            "new_stack": "112,112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 33,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "10",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 33,
            "program": 2,
            "status": 0,
            "opcode": "SCAN",
            "arg": 16,
            "new_ip": 131,
            "new_stack": "112,1",
            "read_addr_first": 242,
            "read_addr_last": 0
        },
        {
            "cycle": 34,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "11",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 34,
            "program": 2,
            "status": 0,
            "opcode": "JUMPG",
            "arg": 3,
            "new_ip": 134,
            "new_stack": "112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 35,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "11,11",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 35,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": -6,
            "new_ip": 135,
            "new_stack": "106",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 36,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "11",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 14,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 36,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "106,106",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 37,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "11",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 37,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "106",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 242,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 38,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "12",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 38,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "107",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 39,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "12,12",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 39,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "107",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 40,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "12",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 15,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 40,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "107,107",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 41,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "12",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 41,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "107",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 243,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 42,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "13",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 42,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "108",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 43,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "13,13",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 43,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "108",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 44,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "13",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 16,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 44,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "108,108",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 45,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "13",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 45,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "108",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 244,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 46,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "14",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 46,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "109",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 47,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "14,14",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 47,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "109",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 48,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "14",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 17,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 48,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "109,109",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 49,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "14",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 49,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "109",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 245,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 50,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "15",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 50,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "110",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 51,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "15,15",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 51,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "110",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 52,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "15",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 18,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 52,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "110,110",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 53,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "15",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 53,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "110",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 246,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 54,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "16",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 54,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "111",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 55,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "16,16",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 55,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "111",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 56,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "16",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 19,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 56,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "111,111",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 57,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "16",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 57,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "111",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 247,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 58,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "17",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 58,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 59,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "17,17",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 59,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 60,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "17",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 20,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 60,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "112,112",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 61,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "17",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 61,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "112",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 248,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 62,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "18",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 62,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "113",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 63,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "18,18",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 63,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "113",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 64,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "18",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 21,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 64,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "113,113",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 65,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "18",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 65,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "113",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 249,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 66,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "19",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 66,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "114",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 67,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "19,19",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 67,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "114",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 68,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "19",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 22,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 68,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "114,114",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 69,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "19",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 69,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "114",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 250,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 70,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "20",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 70,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "115",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 71,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "20,20",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 71,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "115",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 72,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "20",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 23,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 72,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "115,115",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 73,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "20",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 73,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "115",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 251,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 74,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "21",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 74,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "116",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 75,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "21,21",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 75,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "116",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 76,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "21",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 24,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 76,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "116,116",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 77,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "21",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 77,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "116",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 252,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 78,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "22",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 78,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "117",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 79,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "22,22",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 79,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "117",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 80,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "22",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 25,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 80,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "117,117",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 81,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "22",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 81,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "117",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 253,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 82,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "23",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 82,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "118",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 83,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "23,23",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 83,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "118",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 84,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "23",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 26,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 84,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "118,118",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 85,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "23",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 85,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "118",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 254,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 86,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "24",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 86,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "119",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 87,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "24,24",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 87,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "119",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 88,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "24",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 27,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 88,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "119,119",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 89,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "24",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 89,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "119",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 255,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 90,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "25",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 90,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "120",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 91,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "25,25",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 91,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "120",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 92,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "25",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 28,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 92,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "120,120",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 93,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "25",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 93,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "120",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 0,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 94,
            "program": 1,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 2,
            "new_stack": "26",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 94,
            "program": 2,
            "status": 0,
            "opcode": "INC",
            "arg": 1,
            "new_ip": 138,
            "new_stack": "121",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 95,
            "program": 1,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 3,
            "new_stack": "26,26",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 95,
            "program": 2,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 135,
            "new_stack": "121",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 96,
            "program": 1,
            "status": 0,
            "opcode": "COPY",
            "arg": 2,
            "new_ip": 4,
            "new_stack": "26",
            "read_addr_first": 5,
            "read_addr_last": 5,
            "write": {
                "addr": 29,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 96,
            "program": 2,
            "status": 0,
            "opcode": "DUPE",
            "arg": null,
            "new_ip": 136,
            "new_stack": "121,121",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 97,
            "program": 1,
            "status": 0,
            "opcode": "JUMP",
            "arg": -3,
            "new_ip": 1,
            "new_stack": "26",
            "read_addr_first": null,
            "read_addr_last": null
        },
        {
            "cycle": 97,
            "program": 2,
            "status": 0,
            "opcode": "COPY",
            "arg": 3,
            "new_ip": 137,
            "new_stack": "121",
            "read_addr_first": 139,
            "read_addr_last": 139,
            "write": {
                "addr": 1,
                "opcode": "HCF",
                "arg": null
            }
        },
        {
            "cycle": 98,
            "program": 1,
            "status": 2,
            "opcode": "HCF",
            "arg": null,
            "new_ip": 1,
            "new_stack": "26",
            "read_addr_first": null,
            "read_addr_last": null
        }
    ]
};
