import xml.etree.ElementTree as ET
from Models.initiative import Initiative
from Models.vote import Vote

def parseInitiatives():
    doc = ET.parse("initiatives.xml")
    rootNode = doc.getroot()

    initiativeList = rootNode.findall("pt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut")

    parsedInitiatives = []

    for initiative in initiativeList:
        parsedVotes = []
        title = initiative.find("iniTitulo").text
        textLink = initiative.find("iniLinkTexto").text
        initiativeId = initiative.find("iniId").text

        eventsRootNode = initiative.findall("iniEventos")

        if eventsRootNode != []:
            eventList = eventsRootNode[0].findall("pt_gov_ar_objectos_iniciativas_EventosOut")
            if eventList != []:
                for event in eventList:
                    phase = event.find("fase").text
                    voteRootNode = event.findall("votacao")

                    if voteRootNode != []:
                        voteList = voteRootNode[0].findall("pt_gov_ar_objectos_VotacaoOut")
                        voteId = voteList[0].find("id").text
                        result = voteList[0].find("resultado").text
                        votingDetails = voteList[0].find("detalhe")
                        date = voteList[0].find("data").text

                        votingDetails = votingDetails.text if votingDetails is not None else None

                        parsedVotes.append(Vote(voteId, initiativeId, phase, result, votingDetails, date))

        parsedInitiatives.append(Initiative(initiativeId, title, textLink, "XV", parsedVotes))
    
    return parsedInitiatives