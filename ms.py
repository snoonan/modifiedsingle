import webapp2

from google.appengine.ext import ndb
from google.appengine.api import users

from datetime import datetime
import time
import re

import base_handler
import logging
import matches
import winners
import clubs
import tourneys
import players
import handicap
import signup

class DataStore(webapp2.RequestHandler):
   def post(self):
      user = users.get_current_user()

      r_club      = self.request.get('club')
      r_tourney   = self.request.get('tourney')
      r_matchid   = self.request.get('matchid')
      r_playerA   = self.request.get('playerA')
      r_handicapA = self.request.get('handicapA')
      r_scoreA    = self.request.get('scoreA')
      r_targetA   = self.request.get('targetA')
      r_playerB   = self.request.get('playerB')
      r_handicapB = self.request.get('handicapB')
      r_scoreB    = self.request.get('scoreB')
      r_targetB   = self.request.get('targetB')
      r_winner   = self.request.get('winner')

      club = clubs.Club.get_by_id(r_club)

      if user not in club.owners:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return

      tourney = tourneys.Tourney.query(ndb.AND(tourneys.Tourney.slug == r_tourney, tourneys.Tourney.club == club.key)).fetch(1)[0]

      logging.info(r_matchid+" "+r_playerA+" "+r_handicapA)
      logging.info(r_matchid+" "+r_playerB+" "+r_handicapB)
      player_a = players.Player.query(ndb.AND(players.Player.name == r_playerA, players.Player.club == club.key)).fetch(1)
      if player_a == []:
         logging.info("new player "+r_playerA)
         player_a = players.Player()
         player_a.name = r_playerA
         player_a.club = club.key
         player_a.handicap = r_handicapA
         player_a = player_a.put()
      else:
         player_a[0].handicap = r_handicapA
         player_a = player_a[0].put()

      player_b = players.Player.query(ndb.AND(players.Player.name == r_playerB, players.Player.club == club.key)).fetch(1)
      if player_b == []:
         logging.info("new player "+r_playerB)
         player_b = players.Player()
         player_b.name = r_playerB
         player_b.club = club.key
         player_b.handicap = r_handicapB
         player_b = player_b.put()
      else:
         player_b[0].handicap = r_handicapB
         player_b = player_b[0].put()

      match = matches.Match.query(ndb.AND(matches.Match.tourney == tourney.key, matches.Match.matchid == int(r_matchid))).fetch(1)
      if match == []:
         match = matches.Match()
         logging.info(r_matchid+" new")
      else:
         match = match[0]
         logging.info(r_matchid+" update")

      match.club = club.key
      match.tourney = tourney.key
      match.matchid = int(r_matchid)
      match.playerA = player_a
      match.scoreA = int(r_scoreA)
      match.targetA = int(r_targetA)
      match.handicapA = r_handicapA
      match.playerB = player_b
      match.scoreB = int(r_scoreB)
      match.targetB = int(r_targetB)
      match.handicapB = r_handicapB
      if (r_winner != 'undefined'):
         match.winner = int(r_winner)
      match.put()
      self.response.clear()
      self.response.set_status(200)
      self.response.out.write("match recorded")


class WinnerStore(webapp2.RequestHandler):
   def post(self):
      user = users.get_current_user()

      r_club      = self.request.get('club')
      r_tourney   = self.request.get('tourney')
      r_place     = self.request.get('place')
      r_playerA   = self.request.get('pname')
      r_handicapA = self.request.get('rank')

      club = clubs.Club.get_by_id(r_club)

      if user not in club.owners:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return

      tourney = tourneys.Tourney.query(ndb.AND(tourneys.Tourney.slug == r_tourney, tourneys.Tourney.club == club.key)).fetch(1)[0]

      player_a = players.Player.query(ndb.AND(players.Player.name == r_playerA, players.Player.club == club.key)).fetch(1)
      if player_a == []:
         logging.info("new player "+r_playerA)
         player_a = players.Player()
         player_a.name = r_playerA
         player_a.club = club.key
         player_a.handicap = r_handicapA
         player_a = player_a.put()
      else:
         player_a[0].handicap = r_handicapA
         player_a = player_a[0].put()

      winner = winners.Winner.query(ndb.AND(winners.Winner.tourney == tourney.key, winners.Winner.player == player_a)).fetch(1)
      if winner == []:
         winner = winners.Winner()
      else:
         winner = winner[0]

      winner.club = club.key
      winner.tourney = tourney.key
      #winner.matchid = int(r_matchid)
      winner.player = player_a
      winner.handicap = r_handicapA
      winner.place = r_place

      winner.put()
      self.response.clear()
      self.response.set_status(200)
      self.response.out.write("winner recorded")

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

class Invite(webapp2.RequestHandler):
   def post(self):
      user = users.get_current_user()
      r_club      = self.request.get('club')
      r_email      = self.request.get('email')

      user = users.get_current_user()

      logging.info(r_club)
      club = clubs.Club.get_by_id(r_club)
      if club == None:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      if user not in club.owners and user.email() not in club.invited:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      if user not in club.owners:
         club.owners.append(user)

      club.invited.append(r_email)
      club.put()
      club = clubs.Club.get_by_id(r_club)

class Race(webapp2.RequestHandler):
   def post(self):
      user = users.get_current_user()
      r_name      = self.request.get('system')
      r_ranks     = self.request.get('ranks')
      r_races     = self.request.get('races')

      hcap = handicap.Handicap(key=ndb.Key(handicap.Handicap, r_name))
      hcap.ranks = r_ranks
      hcap.races = str(r_races)
      hcap.put()



class Config(webapp2.RequestHandler):
   def get(self, clubid):
      user = users.get_current_user()

      logging.info(clubid)
      club = clubs.Club.get_by_id(clubid)
      logging.info(club)
      if club == None:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      if user not in club.owners and user.email() not in club.invited:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      if user not in club.owners:
         club.owners.append(user)
         club = club.put()

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

class CreateTourneyHandler(base_handler.BaseHandler):
   def get(self, clubid):
      TEMPLATE = 'html/tourneycreateresults.html'

      create = 0
      user = users.get_current_user()
      club = clubs.Club.get_by_id(clubid)
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()
         if user in club.owners or user.email() in club.invited:
            create = 1

      context = {'create': create,
                 'club': club,
                 'login': login}
      self.render_response(TEMPLATE, **context)

   def post(self, clubid):

      user = users.get_current_user()

      size      = self.request.get('size')
      name      = self.request.get('name')
      date      = self.request.get('date')
      slug = re.sub(r"[^A-Za-z0-9]",'-', name)

      logging.info(clubid)

      club = clubs.Club.get_by_id(clubid)
      if club == None:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      if user not in club.owners and user.email() not in club.invited:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      if user not in club.owners:
         club.owners.append(user)
         club = club.put()

      tourney = None
      tourney = tourneys.Tourney.query(ndb.AND(tourneys.Tourney.slug == slug, tourneys.Tourney.club == club.key)).fetch(1)
      if len(tourney) != 0:
         tourney = tourney[0]
         self.response.set_status(200)
         self.response.out.write("/Tourney/"+club.name+"/"+slug)
      else:
         tourney = tourneys.Tourney()
         self.response.set_status(200)
         self.response.out.write("tourney recorded")
      tourney.slug = slug
      tourney.name = name
      tourney.club = club.key
      tourney.date = datetime.fromtimestamp(int(date))
      if size:
         tourney.size = int(size)
      tourney.put()



class IndexHandler(base_handler.BaseHandler):
   def get(self):
      TEMPLATE = 'html/clubs.html'
      user = users.get_current_user()
      login = None

      club = clubs.Club.query().fetch()
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()

      context = {'clubs': club,
                 'login': login}
      self.render_response(TEMPLATE, **context)



class ClubHandler(base_handler.BaseHandler):
   def get(self, clubid):
      TEMPLATE = 'html/tourneys.html'
      user = users.get_current_user()
      login = None
      create = False

      club = clubs.Club.get_by_id(clubid)
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()
         if user in club.owners or user.email() in club.invited:
            if user not in club.owners:
               club.owners.append(user)
               club = club.put()
            create = True

      dates = tourneys.Tourney.query(tourneys.Tourney.club == ndb.Key(clubs.Club, clubid)).order(-tourneys.Tourney.date).fetch()

      for d in dates:
         d.udate = int(time.mktime(d.date.timetuple()))

      context = {'dates': dates,
                 'create': create,
                 'club': club,
                 'login': login}
      self.render_response(TEMPLATE, **context)

class TourneyHandler(base_handler.BaseHandler):
   def get(self, clubid, tname):
      TEMPLATE = 'html/tourneycreateresults.html'

      create = 0
      user = users.get_current_user()
      club = clubs.Club.get_by_id(clubid)
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()
         if user in club.owners or user.email() in club.invited:
            create = 1

      logging.info(tname+" "+clubid)
      tourney = tourneys.Tourney.query(ndb.AND(tourneys.Tourney.slug == tname, tourneys.Tourney.club == club.key)).fetch(1)[0]     # Error handling missing

      signuplist = signup.Signup.query(signup.Signup.tournement == tourney.key).fetch()
      matchlist = matches.Match.query(matches.Match.tourney == tourney.key).order(matches.Match.matchid).fetch()

      logging.info(signuplist)
      context = {'matches': matchlist,
                 'signups': signuplist,
                 'create': create,
                 'tourney': tourney,
                 'club': club,
                 'login': login}
      self.render_response(TEMPLATE, **context)


class SignUpHandler(base_handler.BaseHandler):
   def get(self, clubid, tname):
      user = users.get_current_user()
      login = None
      create=False

      club = clubs.Club.get_by_id(clubid)
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()
         if user in club.owners or user.email() in club.invited:
            create = True

      tourney = tourneys.Tourney.query(ndb.AND(tourneys.Tourney.slug == tname, tourneys.Tourney.club == club.key)).fetch(1)[0]     # Error handling missing

      matchlist = []
      plist = signup.Signup.query(signup.Signup.tournement == tourney.key).fetch()

      self.response.set_status(200)
      self.response.out.write('signedup=[')
      first = True
      for p in plist:
         if not first:
            self.response.out.write(',')
         self.response.out.write('{{"name":"{0}","paid":"{1}"}}'.format(p.player.get().name,p.paid))
         first=False

      self.response.out.write('];')

   def post(self, clubid, tname):
      r_op   = self.request.get('op')
      name   = self.request.get('pname')
      rank   = self.request.get('rank')

      user = users.get_current_user()
      club = clubs.Club.get_by_id(clubid)

      if user not in club.owners:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return

      player = players.Player.query(ndb.AND(players.Player.name == name, players.Player.club == club.key)).fetch(1)
      if len(player) != 0:
         player = player[0]
      else:
         player = players.Player()
         player.club = club.key
         player.name = name
         player.handicap = rank
         player = player.put()

      tourney = tourneys.Tourney.query(ndb.AND(tourneys.Tourney.slug == tname, tourneys.Tourney.club == club.key)).fetch(1)[0]     # Error handling missing
      if r_op == 'update':
         adding = signup.Signup()
         adding.tournement = tourney.key
         adding.player = player.key
         adding.put()
      elif r_op == 'delete':
         remove = signup.Signup.query(ndb.AND(signup.Signup.tournement == tourney.key, signup.Signup.player == player.key)).fetch(1)[0]     # Error handling missing
         remove.key.delete()
      elif r_op == 'paid':
         paid = signup.Signup.query(ndb.AND(signup.Signup.tournement == tourney.key, signup.Signup.player == player.key)).fetch(1)[0]     # Error handling missing
         paid.paid = True
         paid.put()
      elif r_op == 'unpaid':
         paid = signup.Signup.query(ndb.AND(signup.Signup.tournement == tourney.key, signup.Signup.player == player.key)).fetch(1)[0]     # Error handling missing
         paid.paid = False
         paid.put()


class PlayerDetailHandler(base_handler.BaseHandler):
   def get(self, clubid, name):
      TEMPLATE = 'html/detail.html'
      user = users.get_current_user()
      login = None
      create=False

      club = clubs.Club.get_by_id(clubid)
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()
         if user in club.owners or user.email() in club.invited:
            create = True

      matchlist = []
      winlist = []
      player = players.Player.query(ndb.AND(players.Player.name == name, players.Player.club == club.key)).fetch(1)
      if (player == []):
         player = {'name': name}
      else:
         player = player[0]
         matchlist = matches.Match.query(ndb.OR(matches.Match.playerA == player.key, matches.Match.playerB == player.key)).fetch()
         winlist = winners.Winner.query(winners.Winner.player == player.key).fetch()

      context = {'club': club,
                 'player': player,
                 'create': create,
                 'matches': matchlist,
                 'wins': winlist,
                 'login': login}
      self.render_response(TEMPLATE, **context)

   def post(self, clubid, name):
      r_name   = self.request.get('name')
      r_fname  = self.request.get('fname')
      r_lname  = self.request.get('lname')
      r_rank   = self.request.get('rank')
      r_op     = self.request.get('op')

      user = users.get_current_user()
      club = clubs.Club.get_by_id(clubid)

      if user not in club.owners:
         self.response.clear()
         self.response.set_status(405)
         self.response.out.write("Not authorized")
         return
      player = players.Player.query(ndb.AND(players.Player.name == name, players.Player.club == club.key)).fetch(1)
      if player:
         player = player[0]
      else:
         player = players.Player()
         player.club = club.key

      if r_op == 'update':
         player.name = r_name
         if r_fname:
            player.firstName = r_fname
         if r_lname:
            player.lastName = r_lname
         player.handicap = r_rank
         player.put()
      elif r_op == 'delete':
         player.key.delete()



class PlayerListHandler(base_handler.BaseHandler):
   def get(self, clubid):
      TEMPLATE = 'html/list.html'
      user = users.get_current_user()
      login = None

      club = clubs.Club.get_by_id(clubid)
      if user == None:
         login = "<a href="+users.create_login_url()+">login</a>"
      else:
         login = "Logged in as "+user.nickname()

      plist = players.Player.query(players.Player.club == club.key).order(players.Player.name).fetch()
      context = {'club': club,
                 'players': plist,
                 'login': login}
      self.render_response(TEMPLATE, **context)



app = webapp2.WSGIApplication([(r'/Match/', DataStore),
                               (r'/Winner/', WinnerStore),
                               (r'/Config/(.*)', Config),
                               (r'/Create/', Create),
                               (r'/Invite/', Invite),
                               (r'/Race/', Race),
                               (r'/', IndexHandler),
                               (r'/Tourney/(.*)/create', CreateTourneyHandler),
                               (r'/Tourney/(.*)/(.*)/enter', SignUpHandler),
                               (r'/Tourney/(.*)/(.*)', TourneyHandler),
                               (r'/Clubs/(.*)', ClubHandler),
                               (r'/Player/(.*)/(.*)', PlayerDetailHandler),
                               (r'/Player/(.*)', PlayerListHandler),
                              ],
                          debug=True,
                          config=base_handler.CONFIG)

