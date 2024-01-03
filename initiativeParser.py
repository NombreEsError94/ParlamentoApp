import xml.etree.ElementTree as ET
import sqlite3

connection = sqlite3.connect("parliament.db")

def instantiateDb():
    cursor = connection.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Initiatives';")

    if cursor.fetchall() == []:
        print("Creating tables")
        cursor.execute("CREATE TABLE Initiatives(id, title, text, PRIMARY KEY(id))")
        cursor.execute("CREATE TABLE Votes(id INTEGER, initiativeId INTEGER, fase TEXT, result TEXT, details TEXT, date TEXT, PRIMARY KEY(id), FOREIGN KEY(initiativeId) REFERENCES Initiatives(id) )")
        cursor.execute("CREATE TABLE Parties(acronym TEXT, name TEXT)")

    connection.commit()

def parseParties():
    doc = ET.parse("InformacaoBaseXV.xml")
    rootNode = doc.getroot()

    parliamentGroupList = rootNode.findall(".//pt_gov_ar_objectos_GPOut")

    parsedGroups = []

    for group in parliamentGroupList:
        acronym = group.find("sigla").text
        name = group.find("nome").text

        parsedGroups.append((acronym, name))
    
    cursor = connection.cursor()

    cursor.executemany("INSERT INTO Parties VALUES(?, ?)", parsedGroups)

def parseInitiatives():
    doc = ET.parse("IniciativasXV.xml")
    rootNode = doc.getroot()

    initiativeList = rootNode.findall("pt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut")

    parsedInitiatives = []
    parsedVotes = []

    for initiative in initiativeList:
        title = initiative.find("iniTitulo").text
        textLink = initiative.find("iniLinkTexto").text
        initiativeId = initiative.find("iniId").text

        eventsRootNode = initiative.findall("iniEventos")

        if eventsRootNode != []:
            eventList = eventsRootNode[0].findall("pt_gov_ar_objectos_iniciativas_EventosOut")
            if eventList != []:
                for event in eventList:
                    fase = event.find("fase").text
                    voteRootNode = event.findall("votacao")

                    if voteRootNode != []:
                        voteList = voteRootNode[0].findall("pt_gov_ar_objectos_VotacaoOut")
                        voteId = voteList[0].find("id").text
                        result = voteList[0].find("resultado").text
                        votingDetails = voteList[0].find("detalhe")
                        date = voteList[0].find("data").text

                        votingDetails = votingDetails.text if votingDetails is not None else None

                        parsedVotes.append((voteId, initiativeId, fase, result, votingDetails, date))



        parsedInitiatives.append((initiativeId, title, textLink))

    cursor = connection.cursor()
    cursor.executemany("INSERT INTO Initiatives VALUES (?, ?, ?) ", parsedInitiatives)
    cursor.executemany("INSERT INTO Votes VALUES (?, ?, ?, ?, ?, ?)", parsedVotes)
    connection.commit()
    
    

instantiateDb()
parseParties()
parseInitiatives()

connection.close()
