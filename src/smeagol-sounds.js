"use strict";

const vscode = require("vscode");

/**
 * Smeagol Sounds & Easter Eggs
 * Precious! Random Smeagol vocalizations while you code
 * "What has it got in its pocketses?"
 * 
 * Audio Features:
 * - 20+ Smeagol/Gollum quotes with sound IDs for external playback
 * - Sound effects tracking and identification
 * - Configurable probability and cooldown
 * - Output channel for visibility
 * - Ready for audio integration (101 Soundboards, etc.)
 */
class SmeagolSounds {
  constructor() {
    this.enabled = true;
    this.soundChance = 0.02; // 2% chance per update
    this.soundCooldown = 5000; // Minimum 5 seconds between sounds
    this.lastSoundTime = 0;
    this.outputChannel = vscode.window.createOutputChannel("🧙 Smeagol");

    // Sound objects with IDs for potential external audio playback
    this.sounds = [
      { text: "Precious!", id: "precious" },
      { text: "Gollum, gollum!", id: "gollum_laugh" },
      { text: "My preciousss...", id: "precious_hiss" },
      { text: "Tricksy hobbitses!", id: "tricksy" },
      { text: "Yesss, we like it raw!", id: "like_raw" },
      { text: "She took it from us!", id: "took_it" },
      { text: "Thief! Baggins! Thief!", id: "thief" },
      { text: "Nasty, tricksy, false!", id: "nasty" },
      { text: "We hates it forever!", id: "hates" },
      { text: "Sneak, sneak!", id: "sneak" },
      { text: "What has it got in its pocketses?", id: "pocketses" },
      { text: "Filthy little hobbitses!", id: "filthy" },
      { text: "We must have it!", id: "must_have" },
      { text: "It came to us, precious came to us!", id: "came_to_us" },
      { text: "The precious is ours!", id: "precious_ours" },
      { text: "We are alone. All alone.", id: "alone" },
      { text: "It burns us! It burns us!", id: "burns" },
      { text: "The dark takes us home...", id: "dark" },
      { text: "Beautiful! Precious! Mine!", id: "mine" },
      { text: "No! They're going to steal it!", id: "steal" }
    ];

    this.hisses = [
      { text: "Sssssssss", id: "hiss_long" },
      { text: "*hisss*", id: "hiss_short" },
      { text: "Yesssss", id: "yesss" },
      { text: "Preciousssss", id: "precious_long" },
      { text: "Thissss", id: "this_long" }
    ];

    this.gollumSounds = [
      { text: "Gollum, gollum!", id: "gollum_1" },
      { text: "*gollum*", id: "gollum_2" },
      { text: "Glub, glub!", id: "glub" },
      { text: "*wet gargling noises*", id: "gargle" },
      { text: "Ack ack ack!", id: "ack" }
    ];
  }

  /**
   * Randomly emit a Smeagol sound based on configuration
   */
  maybeMakeSound() {
    const config = vscode.workspace.getConfiguration("smeagol");
    
    if (!config.get("sounds.enabled", true)) {
      return;
    }

    const now = Date.now();
    const soundCooldown = config.get("sounds.cooldown", 5000);
    const soundChance = config.get("sounds.chance", 2) / 100; // Convert percentage to decimal

    // Respect cooldown period
    if (now - this.lastSoundTime < soundCooldown) {
      return;
    }

    // Random chance
    if (Math.random() < soundChance) {
      this.lastSoundTime = now;
      this.makeSound();
    }
  }

  /**
   * Play a random Smeagol sound
   */
  makeSound() {
    const rand = Math.random();
    let sound;

    if (rand < 0.65) {
      // 65% chance: precious quotes
      sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
    } else if (rand < 0.8) {
      // 15% chance: hisses
      sound = this.hisses[Math.floor(Math.random() * this.hisses.length)];
    } else {
      // 20% chance: gollum sounds
      sound = this.gollumSounds[Math.floor(Math.random() * this.gollumSounds.length)];
    }

    // Display in status bar and output channel
    this.showStatusMessage(sound.text, sound.id);
  }

  /**
   * Generate random gollum gargling sounds
   */
  getRandomGollumSound() {
    return this.gollumSounds[Math.floor(Math.random() * this.gollumSounds.length)];
  }

  /**
   * Show message in VS Code status bar and output channel
   * @param {string} message - The message to display
   * @param {string} soundId - ID for potential audio playback (e.g., from 101 Soundboards)
   */
  showStatusMessage(message, soundId = "") {
    // Timestamp for output channel
    const timestamp = new Date().toLocaleTimeString();
    const outputText = soundId ? `[${timestamp}] ${message} [${soundId}]` : `[${timestamp}] ${message}`;
    
    // Log to output channel for visibility
    this.outputChannel.appendLine(outputText);
    
    // Show in status bar (brief - 3 seconds)
    const statusMessage = `🧙 ${message}`;
    vscode.window.setStatusBarMessage(statusMessage, 3000);

    // Trigger audio playback if configured
    if (soundId) {
      this.triggerAudio(soundId);
    }
  }

  /**
   * Trigger audio playback
   * This method is prepared for future integration with audio APIs
   * 
   * Possible integration points:
   * - Web Audio API fetch from soundboard
   * - System audio libraries
   * - External audio server
   * - Browser-based sound effects
   * 
   * Sound IDs map to: https://www.101soundboards.com/boards/32962-gollum-smeagol-soundboard
   * 
   * @param {string} soundId - Sound identifier for lookup
   */
  triggerAudio(soundId) {
    // Future enhancement: Fetch and play audio from soundboard API
    // Currently just identifies which sound should play
    // Format: console.log(`Would play sound: ${soundId}`);
    
    // Placeholder for audio library integration
    // Examples:
    // - const audioUrl = `https://www.101soundboards.com/sounds/${soundId}.mp3`;
    // - const audio = new Audio(audioUrl);
    // - audio.play().catch(e => console.log('Audio play failed', e));
  }

  /**
   * Set sound frequency (0-100 as percentage)
   */
  setSoundChance(chance) {
    this.soundChance = Math.max(0, Math.min(1, chance / 100));
  }

  /**
   * Toggle sounds on/off
   */
  setEnabled(enabled) {
    this.enabled = !!enabled;
  }

  /**
   * Get a precious developer message
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

  /**
   * Dispose resources
   */
  dispose() {
    if (this.outputChannel) {
      this.outputChannel.dispose();
    }
  }
}

module.exports = { SmeagolSounds };
