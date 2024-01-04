from Database.sqliteConnector import *
from Parsers.parliamentGroupsParser import parseParliamentGroups
from Parsers.initiativesParser import parseInitiatives

instantiateDb()
parliamentGroups = parseParliamentGroups()
initiatives = parseInitiatives()

for parliamentGroup in parliamentGroups:
    print((parliamentGroup[0], parliamentGroup[1]))

close()
