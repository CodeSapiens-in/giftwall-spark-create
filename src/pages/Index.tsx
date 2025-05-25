
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, Card/Content, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Heart, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                GiftWall
              </h1>
            </div>
            <Link to="/create">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Create Beautiful Group Gifts & Greeting Walls
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Collect heartfelt messages, photos, and contributions from friends and family. 
            Perfect for birthdays, farewells, weddings, and special celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                Create Your Event
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg transition-all duration-300">
              See Example
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/70 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Create & Share</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Create your event page in seconds and share the link with your group. No sign-ups required!</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-orange-500 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Collect Messages</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Friends leave heartfelt messages, photos, and optional contributions all in one beautiful wall.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-purple-500 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Celebrate Together</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Present the beautiful greeting wall and collected contributions to make their day extra special.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Something Special?</h2>
          <p className="text-xl mb-8 opacity-90">Start collecting beautiful memories and contributions today</p>
          <Link to="/create">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Create Your First Event
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">GiftWall</span>
          </div>
          <p className="text-gray-600">Making celebrations more meaningful, one greeting at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
