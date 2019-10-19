using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Bolt.Editor;
using UnityEditor;
using UnityEngine;

public static class BoltPackager
{
	private class Packet
	{
		public bool IsPro
		{
			get { return _pro; }
		}

		public string Path
		{
			get { return _packagePath; }
		}
		
		private readonly bool _pro;
		private readonly string _packageName;
		private readonly string _packagePath;
		private readonly string[] _paths;
		
		public Packet(bool pro, string packageName, params string[] paths)
		{
			_pro = pro;
			_packageName = packageName;
			_packagePath = System.IO.Path.Combine(BoltPathUtility.PackagesPath, string.Format("{0}.unitypackage", packageName));;
			_paths = paths;
		}
		
		public void Pack()
		{
			AssetDatabase.ExportPackage(_paths, _packagePath, ExportPackageOptions.Recurse);
		}

		public void MoveRoot()
		{
			if (File.Exists(_packagePath))
			{
				File.Move(_packagePath, System.IO.Path.Combine(BoltPathUtility.AssetsPath, string.Format("{0}.unitypackage", _packageName)));
			}
		}

		public void DeletePacket()
		{
			if (File.Exists(_packagePath))
			{
				File.Delete(_packagePath);
			}			
		}
		
		public void Delete()
		{
			foreach (var path in _paths)
			{
				if (Directory.Exists(path))
				{
					Directory.Delete(path, true);
				}

				if (File.Exists(path))
				{
					File.Delete(path);
				}
			}	
		}
	}
	
	//========== PRIVATE MEMBERS =======================================================================================

	static readonly Dictionary<string, string> FilesToCopy = new Dictionary<string, string> { 
		{ BoltPathUtility.BoltUserDLLPath, string.Concat(BoltPathUtility.BoltUserDLLPath, ".backup") },
		{ BoltPathUtility.ProjectPath, string.Concat(BoltPathUtility.ProjectPath, ".backup") }
	};

	//========== PUBLIC METHODS ========================================================================================

	[MenuItem("Bolt Dev/1. Package Everything", priority = 0)]
	public static void PackageEverything()
	{
		if (Bolt.Utils.MenuUtililies.FindMissingComponents() != 0) return;
		Package();
	}

	[MenuItem("Bolt Dev/2. Clean Project", priority = 1)]
	public static void DeleteEverything()
	{
		Clean();
	}

	[MenuItem("Bolt Dev/3. Package Bolt", priority = 2)]
	public static void PackageBolt()
	{
		try
		{
			_boltPacket.Pack();
			_boltPacket.MoveRoot();
			BoltLog.Info("Packaging DONE!");
		}
		finally
		{
			AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
		}
	}

	[MenuItem("Bolt Dev/Copy User Data", priority = 20)]
	public static void CopyUserData()
	{
		CopyFiles(FilesToCopy);
	}

	[MenuItem("Bolt Dev/Remove install mark", priority = 21)]
	public static void MarkBoltNotInstalled()
	{
		EditorPrefs.SetBool("$Bolt$First$Startup$Wizard/" + BoltNetwork.Version, false);
		UnityEngine.Debug.Log("Removed Bolt 'install mark'");
	}

	//========== PRIVATE METHODS =======================================================================================

	private static readonly List<Packet> _packets;
	private static readonly Packet _boltPacket;
	private static readonly Packet _extra;
	
	static BoltPackager()
	{
		_packets = new List<Packet>()
		{
			PackageFreeSamples(),
			PackageProSamples(),
			PackageXBoxOne(),
			PackageAndroidIOS(),
			PackageSteam()
		};
		
		_boltPacket = new Packet(false, "bolt", 
			"Assets/Gizmos",
			"Assets/Photon",
			"Assets/Plugins/JsonDotNet"
		);
		
		_extra = new Packet(false, "extra",
			string.Concat(BoltPathUtility.BoltUserDLLPath, ".mdb"),
			"Assets/samples/data",
			// Extra samples
			"Assets/samples/NEW-ServerMonitor",
			"Assets/samples/Voice"
		);
	}
	
	private static void Package()
	{
		try
		{
			BoltLog.Info("Start Packaging!");

			var step = 1;
			var total = _packets.Count;

			foreach (var packet in _packets)
			{
				BoltLog.Info("Packaging {0}/{1}: {2}", step++, total, packet.Path);
				packet.Pack();
			}

			BoltLog.Info("Packaging DONE!");
		}
		finally
		{
			AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
		}
	}

	private static void Clean()
	{
		try
		{
			BoltLog.Info("Start Cleaning!");

			var step = 1;
			var total = _packets.Count;

			foreach (var packet in _packets)
			{
				BoltLog.Info("Packaging {0}/{1}: {2}", step++, total, packet.Path);
				
				packet.Delete();
				
				#if BOLT_CLOUD
				if (packet.IsPro)
				{
					packet.DeletePacket();
				}
				#endif
			}
			
			_extra.Delete();

			BoltLog.Info("Packaging DONE!");
		}
		finally
		{
			AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
		}		
	}

	private static Packet PackageAndroidIOS()
	{
		return new Packet(true,"bolt_mobile_plugins",
			"Assets/Plugins/Android",
			"Assets/Plugins/iOS"
		);
	}

	private static Packet PackageFreeSamples()
	{
		return new Packet(false, "bolt_samples",
			"Assets/samples/AreaOfInterest",
			"Assets/samples/AdvancedTutorial",
			"Assets/samples/ClickToMove",
			"Assets/samples/HeadlessServer",
			"Assets/samples/PhotonCloud",
			"Assets/samples/ThirdPersonCharacter",
			"Assets/samples/GettingStarted",
			"Assets/samples/StreamingData",
			"Assets/samples/BoltInit.cs",
			"Assets/samples/BoltInitSinglePlayer.cs",
			"Assets/samples/Sample_1x1",
			"Assets/samples/LobbyManager",
			"Assets/samples/README.md"
		);
	}

	private static Packet PackageProSamples()
	{
		return new Packet(true, "bolt_pro_samples",
			"Assets/samples/Zeuz",
			"Assets/samples/BoltPro",
			"Assets/samples/A2S"
		);
	}

	private static Packet PackageSteam()
	{
		return new Packet(true,"bolt_steam",
			"Assets/Scripts/Steamworks.NET/SteamManager.cs",
			"Assets/Editor/Steamworks.NET",
			"Assets/Plugins/CSteamworks.bundle",
			"Assets/Plugins/Steamworks.NET",
			"Assets/Plugins/x86/CSteamworks.dll",
			"Assets/Plugins/x86/libCSteamworks.so",
			"Assets/Plugins/x86/libsteam_api.so",
			"Assets/Plugins/x86/steam_api.dll",
			"Assets/Plugins/x86_64/CSteamworks.dll",
			"Assets/Plugins/x86_64/libCSteamworks.so",
			"Assets/Plugins/x86_64/libsteam_api.so",
			"Assets/Plugins/x86_64/steam_api64.dll",
			Path.Combine(BoltPathUtility.ScriptsPath, "udpkit_steam"),
			"Assets/steam_appid.txt",
			Path.Combine(BoltPathUtility.AssembliesPath, Path.Combine("udpkit", "udpkit.platform.steam.dll")),
			"Assets/samples/bolt-steam"
		);
	}

	private static Packet PackageXBoxOne()
	{
		return new Packet(true,"bolt_xbox",
			"Assets/Plugins/XboxOne",
			Path.Combine(BoltPathUtility.AssembliesPath, Path.Combine("managed", "XboxOne")),
			Path.Combine(BoltPathUtility.AssembliesPath, Path.Combine("udpkit", "udpkit.platform.xboxone.dll"))
			
		);
	}

	private static void CopyFiles(Dictionary<string, string> paths)
	{
		foreach (var path in paths.Keys)
		{
			if (File.Exists(path))
			{
				File.Copy(path, paths[path], true);
			}
		}

		BoltLog.Info("Samples files updated");
	}
}