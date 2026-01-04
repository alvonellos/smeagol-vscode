"use strict";

const vscode = require("vscode");

/**
 * Smeagol Sounds & Easter Eggs
 * Precious! Random Smeagol vocalizations while you code
 * "What has it got in its pocketses?"
 */
class SmeagolSounds {
  constructor() {
    this.enabled = true;
    this.soundChance = 0.02; // 2% chance per update
    this.sounds = [
      "Precious!",
      "Gollum, gollum!",
      "My preciousss...",
      "Tricksy hobbitses!",
      "Yesss, we like it raw!",
      "She took it from us!",
      "Thief! Baggins! Thief!",
      "Nasty, tricksy, false!",
      "We hates it forever!",
      "Sneak, sneak!",
      "What has it got in its pocketses?",
      "Filthy little hobbitses!",
      "We must have it!",
      "It came to us, precious came to us!",
      "*Shhhhh*"
    ];

    this.hisses = [
      "Sssssssss",
      "*hisss*",
      "Yesssss",
      "Preciousssss",
      "Thissss"
    ];

    this.lastSoundTime = 0;
    this.soundCooldown = 5000; // Minimum 5 seconds between sounds
  }

  /**
   * Randomly emit a Smeagol sound
   */
  maybeMakeSound() {
    if (!this.enabled) {
      return;
    }

    const now = Date.now();
    if (now - this.lastSoundTime < this.soundCooldown) {
      return;
    }

    if (Math.random() < this.soundChance) {
      this.makeSound();
      this.lastSoundTime = now;
    }
  }

  /**
   * Play a random Smeagol sound
   */
  makeSound() {
    const rand = Math.random();
    let sound;

    if (rand < 0.7) {
      sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
    } else if (rand < 0.9) {
      sound = this.hisses[Math.floor(Math.random() * this.hisses.length)];
    } else {
      sound = this.getRandomGollumSound();
    }

    // Display in status bar
    this.showStatusMessage(sound);
    
    // Try to speak it (if available)
    this.speakSound(sound);
  }

  /**
   * Generate random gollum gargling sounds
   */
  getRandomGollumSound() {
    const sounds = [
      "Gollum, gollum!",
      "*gollum*",
      "Glub, glub!",
      "*wet gargling noises*",
      "Ack ack ack!"
    ];
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  /**
   * Show message in VS Code status bar
   */
  showStatusMessage(message) {
    const channel = vscode.window.createOutputChannel("Smeagol");
    channel.appendLine(`🧙 ${message}`);
  }

  /**
   * Attempt to speak the sound (accessibility feature)
   * Note: This requires system TTS, fails gracefully if not available
   */
  speakSound(message) {
    try {
      // Web Speech API would go here if this was browser-based
      // For VS Code, we'll just log it
      // In a real implementation, could call system `say` command on macOS
      // or `PowerShell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('$message')"` on Windows
    } catch (e) {
      // Silently fail - not critical
    }
  }

  /**
   * Set sound frequency (0.0 - 1.0)
   */
  setSoundChance(chance) {
    this.soundChance = Math.max(0, Math.min(1, chance));
  }

  /**
   * Toggle sounds on/off
   */
  setEnabled(enabled) {
    this.enabled = !!enabled;
  }

  /**
   * Get a precious message
   */
  getPreciousMessage() {
    const messages = [
      "What has the code got in its pocketses?",
      "Precious little bugs, yesss.",
      "The code is ours, precious. All ours!",
      "Tricksy errors, falssy logic!",
      "Nasty syntax errors, we hates them forever!",
      "We must debug it, precious!",
      "The variable calls to us...",
      "Hoard thy dependencies, precious!",
      "What have we become? A programmer!",
      "The npm registry is our Moria.",
      "One library to rule them all...",
      "Commit it, commit it into the darkness!",
      "The CI/CD awaits, precious.",
      "Merge requests precious, precious merge requests!",
      "We are sorry, code. We promised to love it.",
      "The code bit us! Cruel, false code!",
      "We must test it. Test it thoroughly, precious.",
      "Deployment is dangerous. Precious things get broken."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

module.exports = { SmeagolSounds };
