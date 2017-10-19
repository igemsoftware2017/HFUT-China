import os
import django
import sys
import MySQLdb

pro_dir = os.getcwd()
sys.path.append(pro_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BioDesignVer.settings")
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

from biosearch.models import LdaResult as LdaResult

connect = MySQLdb.connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='',
    db='wiki'
)
cur = connect.cursor()
id = 1

def updateIds(teamStr):
    teamId = ''
    if teamStr != '':
        teams = teamStr.split('\n')
        print(teams)
        teams = set(teams)
        ids = list()
        for team in teams:
            position = team.find('_')
            print(team[0:position])
            year = int(team[0:position])
            name = team[position+1:]
            print(year, name)
            cur.execute("select * from team where year=%d and team_name='%s'"%(year, name))
            team = cur.fetchone()
            if team:
                print(team[21])
                ids.append(team[21])
        teamId = ','.join(ids)
    return teamId;

def mainFunc():
    start_pos = 0
    step = 100
    end_pos = start_pos + step
    total = LdaResult.objects.count()
    print('process started')
    while total > 0:
        resultList = LdaResult.objects.all()[start_pos:end_pos]
        start_pos += step
        end_pos += step
        total -= step
        for result in resultList:
            print(result.tracks)
            print("team0")
            teamStr = result.teams_0
            teamIds = updateIds(teamStr)
            result.teamIds_0 = teamIds
            print("team1")
            teamStr = result.teams_1
            teamIds = updateIds(teamStr)
            result.teamIds_1 = teamIds
            print("team2")
            teamStr = result.teams_2
            teamIds = updateIds(teamStr)
            result.teamIds_2 = teamIds
            print("team3")
            teamStr = result.teams_3
            teamIds = updateIds(teamStr)
            result.teamIds_3 = teamIds
            print("team4")
            teamStr = result.teams_4
            teamIds = updateIds(teamStr)
            result.teamIds_4 = teamIds
            result.save()
            
    print('process end')

if __name__ == '__main__':
    django.setup()
    mainFunc()
