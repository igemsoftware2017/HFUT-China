from .models import LdaResult

trackList = ['Community Labs', 'Entrepreneurship', 'Environment', 'Food & Energy', 'Foundational Research', 'Health & Medicine', 'High School', 'Information Processing', 'Manufacturing', 'New Application', 'NotSpecified', 'Policy & Practices']

def getLdaResult(tracks):
    trackHash = 0
    for track in trackList:
        if track in tracks:
            trackHash = trackHash*2+1
        else:
            trackHash = trackHash*2
    ldaResult = LdaResult.objects.filter(tracks=trackHash)[0]
    keywordList = list()
    keywordList.append(ldaResult.keywords_0)
    keywordList.append(ldaResult.keywords_1)
    keywordList.append(ldaResult.keywords_2)
    keywordList.append(ldaResult.keywords_3)
    keywordList.append(ldaResult.keywords_4)
    return keywordList

def getThemeTeam(tracks, theme):
    trackHash = 0
    for track in trackList:
        if track in tracks:
            trackHash = trackHash*2+1
        else:
            trackHash = trackHash*2
    ldaResult = LdaResult.objects.filter(tracks=trackHash)[0]
    if theme==0:
        teamIdStr = ldaResult.teamIds_0
    if theme==1:
        teamIdStr = ldaResult.teamIds_1
    if theme==2:
        teamIdStr = ldaResult.teamIds_2
    if theme==3:
        teamIdStr = ldaResult.teamIds_3
    if theme==4:
        teamIdStr = ldaResult.teamIds_4
    teamIds = teamIdStr.split(',')
    return teamIds