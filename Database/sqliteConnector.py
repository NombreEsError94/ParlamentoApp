import sqlite3

connection = sqlite3.connect("parliament.db")

def instantiateDb():
    cursor = connection.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Initiatives';")

    if cursor.fetchall() == []:
        print("Creating tables")
        cursor.execute("CREATE TABLE Initiatives(id, title, text, PRIMARY KEY(id))")
        cursor.execute("CREATE TABLE Votes(id INTEGER, initiativeId INTEGER, fase TEXT, result TEXT, details TEXT, date TEXT, PRIMARY KEY(id), FOREIGN KEY(initiativeId) REFERENCES Initiatives(id) )")
        cursor.execute("CREATE TABLE ParliamentGroups(acronym TEXT, name TEXT)")

    connection.commit()

def getParliamentGroups():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM ParliamentGroups")
    parliamentGroups = cursor.fetchall()
    
    cursor.close()

    return parliamentGroups

def insertParliamentGroups(parliamentGroups):
    cursor = connection.cursor()
    cursor.executemany("INSERT INTO ParliamentGroups VALUES(?, ?)", parliamentGroups)
    cursor.close()

    connection.commit()

def close():
    connection.close()