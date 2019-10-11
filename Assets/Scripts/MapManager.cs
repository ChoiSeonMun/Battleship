using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class MapManager : MonoBehaviour
{
    const int MAX_W = 50;
    const int MAX_H = 50;
    const string MAP_PATH = @".\Assets\Maps\map_test.txt";

    [Header("◆ Prefabs")]
    [SerializeField]
    private GameObject hexOcean = null;
    [SerializeField]
    private GameObject hexIsland = null;
    [SerializeField]
    private GameObject hexLand = null;

    int w, h;
    int[,] cells;

    void Start()
    {
        GenerateMap(16, 9);
    }

    void GenerateMap(int w, int h)
    {
        this.w = w;
        this.h = h;
        cells = new int[h, w];

        LoadMap(MAP_PATH);

        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                Vector2 pos = Hex.HexToSqr(x, y);
                switch (cells[y, x])
                {
                    case 1:
                        Instantiate(hexOcean, pos, Quaternion.identity, transform);
                        break;
                    case 2:
                        Instantiate(hexIsland, pos, Quaternion.identity, transform);
                        break;
                    case 3:
                        Instantiate(hexLand, pos, Quaternion.identity, transform);
                        break;
                    default:
                        throw new System.ComponentModel.InvalidEnumArgumentException($"※ Unhandled tile val: {cells[y, x].ToString()}");
                }
            }
        }
    }

    void SaveMap()
    {
        using (StreamWriter streamWriter = new StreamWriter(MAP_PATH))
        {
            streamWriter.WriteLine($"{w} {h}");
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    streamWriter.Write(string.Join(" ", cells[y, x]));
                }
                streamWriter.WriteLine();
            }
        }
    }
    void LoadMap(string path)
    {
        using (StreamReader streamReader = new StreamReader(path))
        {
            string line = streamReader.ReadLine();
            int[] wh = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));
            w = wh[0];
            h = wh[1];
            Debug.Log(w + ", " + h);

            int y = 0;
            while ((line = streamReader.ReadLine()) != null)
            {
                int[] vals = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));
                int x = 0;
                foreach (int val in vals)
                {
                    cells[y, x] = val;
                    x++;
                }
                y++;
            }
        }

        // DEBUG
        string str = "";
        for(int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                str += cells[y, x].ToString() + " ";
            }
            str += "\n";
        }
        Debug.Log(str);
    }
}
