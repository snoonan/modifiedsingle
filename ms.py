import webapp2

from google.appengine.ext import ndb
from datetime import datetime

import logging
import matches
import clubs
import players

class DataStore(webapp2.RequestHandler):
   def post(self):
      logging.info( "posting")
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
      winner = players.Player.get_by_id(r_playerW)
      logging.info( "winner:"+str(winner)+" "+r_playerW)
      if winner == None:
         winner = players.Player(key=ndb.Key(players.Player, r_playerW))
         winner.handicap = r_handicapW
         winner.put()
         winner = players.Player.get_by_id(r_playerW)
      loser  = players.Player.get_by_id(r_playerL)
      if loser == None:
         loser = players.Player(key=ndb.Key(players.Player, r_playerL))
         loser.handicap = r_handicapL
         loser.put()
         loser  = players.Player.get_by_id(r_playerL)

      match = matches.Match()
      match.club = club.key
      match.matchid = int(r_matchid)
      match.date = datetime.fromtimestamp(float(r_date))
      match.playerW = winner.key
      match.scoreW = int(r_scoreW)
      match.targetW = int(r_targetW)
      match.handicapW = r_handicapW
      match.playerL = loser.key
      match.scoreL = int(r_scoreL)
      match.targetL = int(r_targetL)
      match.handicapL = r_handicapL
      match.put()
      self.response.clear()
      self.response.set_status(200)
      self.response.out.write("match recorded")


app = webapp2.WSGIApplication([(r'/.*', DataStore)],
                          debug=True)

