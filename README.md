# e2j

gulp => excel2json

# No.1

npm or yarn e2j

# 数组 array

| A           |  B   |   C    |           D           |    E     | F                          |
| :---------- | :--: | :----: | :-------------------: | :------: | -------------------------- |
| (备注 decs) | 主键 |  姓名  |         成绩          | 三好学生 | 家庭成员                   |
| 类型        | int  | string |        object         |   bool   | array                      |
| 字段        |  id  |  name  |         grade         | is3Good  | familys                    |
|             |  1   |  小明  | {math:100,english:80} |   true   | \[farther,mother,brother\] |
|             |  2   |  小红  | {math:100,english:80} |   true   | \[farther,mother,brother\] |
|             |  3   |  小绿  | {math:100,english:80} |   true   | \[farther,mother,brother\] |

gulp e2j =>

` ``

[{
"id": 1,
"name": "小明",
"grade": {
"math": 100,
"english": 80,
},
"is3Good": true,
"familys": ["farther","mother", "brother"]
},{
"id": 1,
"name": "小红",
"grade": {
"math": 100,
"english": 80,
},
"is3Good": true,
"familys": ["farther","mother", "brother"]
},{
"id": 1,
"name": "小绿",
"grade": {
"math": 100,
"english": 80,
},
"is3Good": true,
"familys": ["farther","mother", "brother"]
}
]

` ``

# 对象 object

| A           |  B   |   C    |           D           |    E     | F                          |
| :---------- | :--: | :----: | :-------------------: | :------: | -------------------------- |
| (备注 decs) | 主键 |  姓名  |         成绩          | 三好学生 | 家庭成员                   |
| 类型        | int  | string |        object         |   bool   | array                      |
| \$key       |  id  |  name  |         grade         | is3Good  | familys                    |
| xiaoming    |  1   |  小明  | {math:100,english:80} |   true   | \[farther,mother,brother\] |
| xiaohong    |  2   |  小红  | {math:100,english:80} |   true   | \[farther,mother,brother\] |
| xiaolv      |  3   |  小绿  | {math:100,english:80} |   true   | \[farther,mother,brother\] |

gulp e2j =>

` ``

{
"xiaoming":{
"id": 1,
"name": "小明",
"grade": {
"math": 100,
"english": 80,
},
"is3Good": true,
"familys": ["farther","mother", "brother"]
},
"xiaohong":{
"id": 1,
"name": "小红",
"grade": {
"math": 100,
"english": 80,
},
"is3Good": true,
"familys": ["farther","mother", "brother"]
},
"xiaolv":{
"id": 1,
"name": "小绿",
"grade": {
"math": 100,
"english": 80,
},
"is3Good": true,
"familys": ["farther","mother", "brother"]
}
}

` ``