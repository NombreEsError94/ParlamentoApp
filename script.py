from Database.sqliteConnector import *
from Parsers.parliamentGroupsParser import parseParliamentGroups
from Parsers.initiativesParser import parseInitiatives

instantiateDb()

parsedParliamentGroups = parseParliamentGroups()
parliamentGroups = getParliamentGroups()

diff = [group for group in parsedParliamentGroups if group[0] not in [x[0] for x in parliamentGroups]]

print(parsedParliamentGroups)
print(parliamentGroups)

print(diff)

if len(diff) > 0:
    insertParliamentGroups(diff)


close()
