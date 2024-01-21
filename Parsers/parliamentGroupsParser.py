import xml.etree.ElementTree as ET
from Models.parliamentGroup import ParliamentGroup

def parseParliamentGroups():
    doc = ET.parse("parliamentGroups.xml")
    rootNode = doc.getroot()

    parliamentGroupList = rootNode.findall(".//pt_gov_ar_objectos_GPOut")

    parsedGroups = []

    for group in parliamentGroupList:
        acronym = group.find("sigla").text
        name = group.find("nome").text

        parsedGroups.append(ParliamentGroup(acronym, name))
    
    return parsedGroups