import webapp2

from google.appengine.ext import ndb
from datetime import datetime

import logging
import matches
import clubs
import players

class DataStore(webapp2.RequestHandler):
   def post(self):
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
      if club == None:
         club = clubs.Club(key=ndb.Key(clubs.Club, r_club))
         club.name = r_club
         club.put()
         club = clubs.Club.get_by_id(r_club)

      winner = players.Player.query(ndb.AND(players.Player.name == r_playerW, players.Player.club == club.key)).fetch(1)
      if winner == []:
         winner = players.Player()
         winner.name = r_playerW
         winner.club = club.key
         winner.handicap = r_handicapW
         winner = winner.put()
      else:
         winner = winner[0].key

      loser = players.Player.query(ndb.AND(players.Player.name == r_playerL, players.Player.club == club.key)).fetch(1)
      if loser == []:
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


app = webapp2.WSGIApplication([(r'/.*', DataStore)],
                          debug=True)

