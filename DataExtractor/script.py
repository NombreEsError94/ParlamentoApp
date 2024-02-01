from Database.sqliteConnector import *
from Parsers.parliamentGroupsParser import parseParliamentGroups
from Parsers.initiativesParser import parseInitiatives
from WebScraper.scraper import *

downloadInitiativesFile()
downloadParliamentGroupsFile()

initDb()

parsedParliamentGroups = parseParliamentGroups()
parliamentGroups = getParliamentGroups()

parliamentDiff = [group for group in parsedParliamentGroups if group.acronym not in [x.acronym for x in parliamentGroups]]

print(len(parliamentDiff))

if len(parliamentDiff) > 0:
    insertParliamentGroups(parliamentDiff)

parsedInitiatives = parseInitiatives()
initiatives = getInitiatives()

insertInitiatives(parsedInitiatives)

close()
