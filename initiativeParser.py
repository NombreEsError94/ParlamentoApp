import json
import xml.etree.ElementTree as ET
import sqlite3

class Initiative:
    def __init__(self, id, title, text):
        self.id = id
        self.title = title
        self.text = text

connection = sqlite3.connect("parliament.db")

def instantiateDb():
    cursor = connection.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Initiatives';")

    if cursor.fetchall() == []:
        print("Creating tables")
        cursor.execute("CREATE TABLE Initiatives(id, title, text, PRIMARY KEY(id))")
        cursor.execute("CREATE TABLE ")

    connection.commit()

def parseInitiatives():
    doc = ET.parse("IniciativasXV.xml")
    rootNode = doc.getroot()

    initiativeList = rootNode.findall('pt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut')

    parsedInitiatives = []

    for initiative in initiativeList:
        title = initiative.find('iniTitulo').text
        textLink = initiative.find('iniLinkTexto').text
        id = initiative.find('iniNr').text

        eventsRootNode = initiative.findall('iniEventos')

        if eventsRootNode != []:
            eventList = eventsRootNode[0].findall('pt_gov_ar_objectos_iniciativas_EventosOut')
            if eventList != []:
                for event in eventList:
                    fase = event.find('fase').text
                    voteRootNode = event.findall('votacao')

                    if voteRootNode != []:
                        voteList = voteRootNode[0].findall('pt_gov_ar_objectos_VotacaoOut')
                        print(title)
                        print(fase)
                        voteId = voteList[0].find('id')
                        result = voteList[0].find('resultado')
                        votingDetails = voteList[0].find('detalhe')
                        date = voteList[0].find('data')
                        
                        if voteId is not None:
                            print(voteId.text)

                        if result is not None:
                            print(result.text)
                        
                        if votingDetails is not None:
                            print(votingDetails.text)

                        if date is not None:
                            print(date.text)

        parsedInitiatives.append(Initiative(id, title, textLink))

    cursor = connection.cursor()
    cursor.executemany("INSERT INTO Initiatives VALUES (?, ?, ?) ", parsedInitiatives)
    connection.commit()

instantiateDb()
parseInitiatives()

#cursor = connection.cursor()
#for row in cursor.execute("""SELECT id, title FROM Initiatives"""):
#    print(row)

#for row in cursor.execute("""SELECT COUNT(*) FROM Initiatives"""):
#    print(row)

#connection.close()
