class Vote:
    def __init__(self, id, initiativeId, phase, result, votingDetails, date):
        self.id = id
        self.initiativeId = initiativeId
        self.phase = phase
        self.result = result
        self.votingDetails = votingDetails
        self.date = date

    # Parses the logic from the voting details to a list of parties and respective votes
    # If the votingDetails is None or empty, all parties voted Yes
    # If approved, votingDetails will contain
    @staticmethod
    def getVotingParliamentGroups(vote, parliamentGroups):
        votingDetails = vote.votingDetails
        approved = []
        rejected = []
        abstentions = []

        if votingDetails == '':
            approved = parliamentGroups
            return (approved, rejected, abstentions)
        
        separatedCategories = votingDetails.split("<BR>")

        for category in separatedCategories:
            splittedCategory = category.split(':')
            votingValue, votingParties = splittedCategory[0], splittedCategory[1].replace("<I>", "").replace("</I>", "").replace(" ", "").split(',')

            match votingValue:
                case "A Favor":
                    approved = votingParties
                    break
                case "Contra":
                    rejected = votingParties
                    break
                case "Abstenção":
                    abstentions = votingParties
                    break
        
        # Since sometimes parties are ommited, we need to find which parties are missing and adding them to 
        if approved == []:
            approved = Vote.__getMissingParliamentGroups(parliamentGroups, rejected + abstentions)
        elif rejected == []:
            rejected = Vote.__getMissingParliamentGroups(parliamentGroups, approved + abstentions)
        elif abstentions == []:
            abstentions = Vote.__getMissingParliamentGroups(parliamentGroups, approved + rejected)

        return (approved, rejected, abstentions)
    
    @staticmethod
    def __getMissingParliamentGroups(completeList, subList):
        return completeList - subList



