import MySQLdb

connect = MySQLdb.connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='qaz123',
    db='biodesignver'
)
cur = connect.cursor()
cur2 = connect.cursor()

connect1 = MySQLdb.connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='qaz123',
    db='wiki'
)
cur1 = connect1.cursor()

cur.execute("select * from simpepart")
part = cur.fetchone()
while part:
    teams = part[6]
    if teams!="":
        teams = teams.split(',')
        ids = list()
        for team in teams:
            print(team)
            position = team.find('_')
            year = int(team[0:position])
            name = team[position+1:]
            cur1.execute("select * from team where year=%d and team_name='%s'"%(year, name))
            team = cur1.fetchone()
            if team:
                print(team[18])
                ids.append(team[18])
        teamId = ','.join(ids)
        cur2.execute("update simpepart set teamId='%s' where part_id=%d"%(teamId, part[0]))
    part = cur.fetchone()
connect.commit()
