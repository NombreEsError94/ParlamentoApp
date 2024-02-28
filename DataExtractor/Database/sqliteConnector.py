import sqlite3
from Models.parliamentGroup import ParliamentGroup
from Models.vote import Vote

connection = sqlite3.connect("parliament.db")

# Allows for query traceability
#connection.set_trace_callback(print)

def initDb():
    cursor = connection.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Initiatives';")

    if cursor.fetchall() == []:
        print("Creating tables")
        cursor.execute("CREATE TABLE Initiatives(id INTEGER, title TEXT, text TEXT, legislature TEXT, PRIMARY KEY(id))")
        cursor.execute("CREATE TABLE Votes(id INTEGER, initiativeId INTEGER, fase TEXT, result TEXT, details TEXT, date TEXT, PRIMARY KEY(id), FOREIGN KEY(initiativeId) REFERENCES Initiatives(id) )")
        cursor.execute("CREATE TABLE ParliamentGroupsVotes(parliamentGroupAcronym TEXT, voteId INTEGER, vote TEXT, PRIMARY KEY(parliamentGroupAcronym, voteId), FOREIGN KEY(parliamentGroupAcronym) REFERENCES ParliamentGroups(acronym), FOREIGN KEY(voteId) REFERENCES Votes(id))")
        cursor.execute("CREATE TABLE ParliamentGroups(acronym TEXT, name TEXT, legislature TEXT, PRIMARY KEY(acronym))")

    connection.commit()

def getParliamentGroups():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM ParliamentGroups")
    parliamentGroups = cursor.fetchall()
    
    cursor.close()

    return list(map(lambda g: ParliamentGroup(g[0], g[1], g[2]), parliamentGroups))

def getInitiatives():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Initiatives")
    initiatives = cursor.fetchall()

    cursor.close()

    return initiatives

def insertParliamentGroups(parliamentGroups):
    cursor = connection.cursor()
    parliamentGroupsTuple = map(lambda g: (g.acronym, g.name, g.legislature), parliamentGroups)
    cursor.executemany("INSERT INTO ParliamentGroups VALUES(?, ?, ?)", parliamentGroupsTuple)
    cursor.close()

    connection.commit()

def insertInitiatives(initiatives):

    parliamentGroups = getParliamentGroups()

    cursor = connection.cursor()

    cursor.execute("DELETE FROM Initiatives")
    cursor.execute("DELETE FROM Votes")
    cursor.execute("DELETE FROM ParliamentGroupsVotes")

    connection.commit()

    initiativesToInsert = []
    votesToInsert = []

    for initiative in initiatives:
        initiativeTuple = (initiative.id, initiative.title, initiative.text, initiative.legislature)
        votesTuple = map(lambda v: (int(v.id), int(initiative.id),
                                    v.phase if v.phase is not None else "",
                                    v.result if v.result is not None else "",
                                    v.votingDetails if v.votingDetails is not None else "",
                                    v.date if v.date is not None else "")
                                    , initiative.votes)

        initiativesToInsert.append(initiativeTuple)
        votesToInsert.extend(list(votesTuple))

    votesPerParliamentGroup = list(map(lambda v: (v[0], Vote.getVotingParliamentGroups(v, map(lambda p: p.acronym, parliamentGroups))), votesToInsert))
    parliamentGroupsVotes = []

    for item in votesPerParliamentGroup:
        voteId = item[0]
        approved = item[1][0]
        rejected = item[1][1]
        abstentions = item[1][2]

        parliamentGroupsVotes.extend(list(map(lambda v: (v, voteId, "Approved"), approved)))
        parliamentGroupsVotes.extend(list(map(lambda v: (v, voteId, "Rejected"), rejected)))
        parliamentGroupsVotes.extend(list(map(lambda v: (v, voteId, "Abstention"), abstentions)))
        

    cursor.executemany("INSERT INTO Initiatives VALUES(?, ?, ?, ?)", initiativesToInsert)
    cursor.executemany("INSERT INTO Votes VALUES(?, ?, ?, ?, ?, ?)", votesToInsert)
    cursor.executemany("INSERT INTO ParliamentGroupsVotes VALUES(?, ?, ?)", parliamentGroupsVotes)

    cursor.close()

    connection.commit()

def close():
    connection.close()