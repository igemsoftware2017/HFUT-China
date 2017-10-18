import os
import django
import sys
import MySQLdb

pro_dir = os.getcwd()
sys.path.append(pro_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BioDesignVer.settings")
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

from biosearch.models import SimplePart as SimplePart

connect = MySQLdb.connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='',
    db='wiki'
)
cur = connect.cursor()
id = 1

def mainFunc():
    start_pos = 0
    step = 100
    end_pos = start_pos + step
    total = SimplePart.objects.count()
    print('process started')
    while total > 0:
        parts_list = SimplePart.objects.all()[start_pos:end_pos]
        start_pos += step
        end_pos += step
        total -= step
        for part in parts_list:
            print(part.part_name)
            teamStr = part.team
            if teamStr != '':
                teams = teamStr.split(',')
                teams = set(teams)
                ids = list()
                for team in teams:
                    position = team.find('_')
                    year = int(team[0:position])
                    name = team[position+1:]
                    print(year, name)
                    cur.execute("select * from team where year=%d and team_name='%s'"%(year, name))
                    team = cur.fetchone()
                    print(team[21])
                    ids.append(team[21])
                teamId = ','.join(ids)
                part.teamId = teamId
                part.save()
    print('process end')

if __name__ == '__main__':
    django.setup()
    mainFunc()
