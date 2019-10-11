using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;
    public enum EMode { NONE, SELECT, ATTACK, END };

    public EMode Mode { get; private set; } = EMode.SELECT;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    void Start()
    {
        InitializePlacementPhase();
    }
    void Update()
    {
        
    }

    public void InitializePlacementPhase()
    {
        const string MAP_PATH = @".\Assets\Maps\map_test.txt";

        MapManager.instance.LoadMap(MAP_PATH);
        MapManager.instance.GenerateMap();
        UIManager.instance.UpdatePlacementPhase();
    }
}
