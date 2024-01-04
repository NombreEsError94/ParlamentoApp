import xml.etree.ElementTree as ET

def parseParliamentGroups():
    doc = ET.parse("InformacaoBaseXV.xml")
    rootNode = doc.getroot()

    parliamentGroupList = rootNode.findall(".//pt_gov_ar_objectos_GPOut")

    parsedGroups = []

    for group in parliamentGroupList:
        acronym = group.find("sigla").text
        name = group.find("nome").text

        parsedGroups.append((acronym, name))
    
    return parsedGroups