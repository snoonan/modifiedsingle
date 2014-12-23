import webapp2

from google.appengine.ext import ndb
from google.appengine.api import users

from datetime import datetime

import logging
import matches
import clubs
import players

class DataStore(webapp2.RequestHandler):
   def post(self):
      user = users.get_current_user()

      r_club      = self.request.get('club')
      r_matchid   = self.request.get('matchid')
      r_date      = self.request.get('date')
      r_playerW   = self.request.get('playerW')
      r_handicapW = self.request.get('handicapW')
      r_scoreW    = self.request.get('scoreW')
      r_targetW   = self.request.get('targetW')
      r_playerL   = self.request.get('playerL')
      r_handicapL = self.request.get('handicapL')
      r_scoreL    = self.request.get('scoreL')
      r_targetL   = self.request.get('targetL')

      club = clubs.Club.get_by_id(r_club)


      if user.user_id() not in club.owners:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")

      winner = players.Player.query(ndb.AND(players.Player.name == r_playerW, players.Player.club == club.key)).fetch(1)
      if winner == []:
         logging.info("new player "+r_playerW)
         winner = players.Player()
         winner.name = r_playerW
         winner.club = club.key
         winner.handicap = r_handicapW
         winner = winner.put()
      else:
         winner = winner[0].key

      loser = players.Player.query(ndb.AND(players.Player.name == r_playerL, players.Player.club == club.key)).fetch(1)
      if loser == []:
         logging.info("new player "+r_playerL)
         loser = players.Player()
         loser.name = r_playerL
         loser.club = club.key
         loser.handicap = r_handicapL
         loser = loser.put()
      else:
         loser = loser[0].key

      match = matches.Match()
      match.club = club.key
      match.matchid = int(r_matchid)
      match.date = datetime.fromtimestamp(float(r_date))
      match.playerW = winner
      match.scoreW = int(r_scoreW)
      match.targetW = int(r_targetW)
      match.handicapW = r_handicapW
      match.playerL = loser
      match.scoreL = int(r_scoreL)
      match.targetL = int(r_targetL)
      match.handicapL = r_handicapL
      match.put()
      self.response.clear()
      self.response.set_status(200)
      self.response.out.write("match recorded")

class Create(webapp2.RequestHandler):
   def post(self):
      user = users.get_current_user()
      r_club      = self.request.get('club')
      r_clubname      = self.request.get('clubname')

      club = clubs.Club(key=ndb.Key(clubs.Club, r_club))
      club.name = r_clubname
      club.owners = [user]
      club.put()
      club = clubs.Club.get_by_id(r_club)
      bye = players.Player()
      bye.name = "Bye"
      bye.club = club.key
      bye.handicap = "Bye"
      bye = bye.put()



class Config(webapp2.RequestHandler):
   def get(self):
      user = users.get_current_user()

      club = clubs.Club.query(clubs.Club.owners == user).fetch(1)
      if club == []:
         club = clubs.Club.query(clubs.Club.invited == user.email()).fetch(1)
         if club == []:
            self.response.clear()
            self.response.set_status(405)
            self.response.out.write("Not authorized")
            return
         club[0].owner.append(user.user_id())
         club[0].put()

      club = club[0]
      plist = players.Player.query(players.Player.club == club.key).order(players.Player.name).fetch()
      self.response.set_status(200)
      self.response.out.write('club="{}";\n'.format(club.key.id(),))
      self.response.out.write('clubname="{}";\n'.format(club.name,))
      self.response.out.write('players=[\n')
      for p in plist:
         if p.name == "Bye":
            continue
         self.response.out.write('         {{"name":"{0}","rank":"{1}"}},\n'.format(p.name,p.handicap))

      self.response.out.write('            {"name":"Bye","rank":"Bye"}\n')
      self.response.out.write('            ];\n')


app = webapp2.WSGIApplication([(r'/Match/.*', DataStore),
                               (r'/Config/.*', Config),
                               (r'/Create/.*', Create),
                              ],
                          debug=True)

