using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class MapManager : MonoBehaviour
{
    public static MapManager instance;
    static readonly int shipTypesCount = System.Enum.GetNames(typeof(Ship.EShip)).Length;

    [Header("◆ Prefabs")]
    [SerializeField]
    private GameObject hexOcean = null;
    [SerializeField]
    private GameObject hexShore = null;
    [SerializeField]
    private GameObject hexIsland = null;
    [SerializeField]
    private GameObject hexLand = null;


    int width, height;
    int[,] tiles;
    public int[] ShipCounts { get; private set; } = new int[shipTypesCount];
    int[,] ships;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    public void GenerateMap()
    {
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                Vector2 pos = Hex.HexToSqr(x, y);
                switch (tiles[y, x])
                {
                    case 1:  // 바다
                        Instantiate(hexOcean, pos, Quaternion.identity, transform);
                        break;
                    case 2:  // 연안
                        Instantiate(hexShore, pos, Quaternion.identity, transform);
                        break;
                    case 3:  // 섬
                        Instantiate(hexIsland, pos, Quaternion.identity, transform);
                        break;
                    case 4:  // 육지
                        Instantiate(hexLand, pos, Quaternion.identity, transform);
                        break;
                    default:
                        throw new System.ComponentModel.InvalidEnumArgumentException($"※ Unhandled tile val: {tiles[y, x].ToString()}");
                }
            }
        }
    }

    public void SaveMap(string path)
    {
        using (StreamWriter streamWriter = new StreamWriter(path))
        {
            streamWriter.WriteLine($"{width} {height}");
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    streamWriter.Write(string.Join(" ", tiles[y, x]));
                }
                streamWriter.WriteLine();
            }
        }
    }
    public void LoadMap(string path)
    {
        using (StreamReader streamReader = new StreamReader(path))
        {
            string line = streamReader.ReadLine();
            ShipCounts = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));

            line = streamReader.ReadLine();
            int[] wh = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));
            width = wh[0];
            height = wh[1];
            tiles = new int[height, width];

            Debug.Log($"Loading map: B{ShipCounts[(int)Ship.EShip.BATTLESHIP]} C{ShipCounts[(int)Ship.EShip.CRUISER]} D{ShipCounts[(int)Ship.EShip.DESTROYER]} {width}X{height}");

            int y = 0;
            while ((line = streamReader.ReadLine()) != null)
            {
                int[] vals = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));
                int x = 0;
                foreach (int val in vals)
                {
                    tiles[y, x] = val;
                    x++;
                }
                y++;
                if (y == height) break;  // 이후 파일 내용 무시
            }
        }
    }

    public void DecreaseShipCount(Ship.EShip eShip)
    {
        if ((--ShipCounts[(int)eShip]) < 0) throw new System.Exception("※ ShipCount is lower than 0");
        UIManager.instance.UpdatePlacementPhase();
    }
    public void IncreaseShipCount(Ship.EShip eShip)
    {
        ShipCounts[(int)eShip]++;
        UIManager.instance.UpdatePlacementPhase();
    }
}
